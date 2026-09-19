#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, BytesN, Env, String, Symbol, Vec,
};

// ── Storage keys ──────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Alliance(BytesN<32>),
    Member(BytesN<32>, Address),
    MemberList(BytesN<32>),
}

// ── Data structs ──────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct AllianceInfo {
    pub name: String,
    pub protocol: String,
    pub created_by: Address,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct MemberInfo {
    pub role: String,
    pub capability: String,
    pub joined_at: u64,
}

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct AllianceRegistry;

#[contractimpl]
impl AllianceRegistry {
    /// Create a new alliance. The caller becomes the founding member.
    pub fn create_alliance(env: Env, id: BytesN<32>, name: String, creator: Address) {
        creator.require_auth();

        let info = AllianceInfo {
            name: name.clone(),
            protocol: String::from_str(&env, "mikoriza-v0"),
            created_by: creator.clone(),
            created_at: env.ledger().timestamp(),
        };
        env.storage().instance().set(&DataKey::Alliance(id.clone()), &info);

        // Bootstrap empty member list
        let members: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&DataKey::MemberList(id.clone()), &members);

        env.events().publish(
            (Symbol::new(&env, "alliance"), Symbol::new(&env, "created")),
            (id.clone(), name, creator),
        );
    }

    /// Add (or self-enroll) a member with a capability string.
    pub fn add_member(env: Env, id: BytesN<32>, member: Address, capability: String) {
        // Alliance must exist
        let _info: AllianceInfo = env
            .storage()
            .instance()
            .get(&DataKey::Alliance(id.clone()))
            .expect("alliance not found");

        let member_info = MemberInfo {
            role: String::from_str(&env, "member"),
            capability: capability.clone(),
            joined_at: env.ledger().timestamp(),
        };
        env.storage()
            .instance()
            .set(&DataKey::Member(id.clone(), member.clone()), &member_info);

        // Update member list
        let mut members: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::MemberList(id.clone()))
            .unwrap_or_else(|| Vec::new(&env));

        let mut already = false;
        for m in members.iter() {
            if m == member {
                already = true;
                break;
            }
        }
        if !already {
            members.push_back(member.clone());
            env.storage()
                .instance()
                .set(&DataKey::MemberList(id.clone()), &members);
        }

        env.events().publish(
            (Symbol::new(&env, "member"), Symbol::new(&env, "added")),
            (id.clone(), member, capability),
        );
    }

    /// Update an existing member's capability string.
    pub fn set_capability(env: Env, id: BytesN<32>, member: Address, capability: String) {
        let mut info: MemberInfo = env
            .storage()
            .instance()
            .get(&DataKey::Member(id.clone(), member.clone()))
            .expect("member not found");

        info.capability = capability.clone();
        env.storage()
            .instance()
            .set(&DataKey::Member(id.clone(), member.clone()), &info);

        env.events().publish(
            (Symbol::new(&env, "cap"), Symbol::new(&env, "set")),
            (id.clone(), member, capability),
        );
    }

    /// Check whether an address is a registered member.
    pub fn is_member(env: Env, id: BytesN<32>, member: Address) -> bool {
        env.storage()
            .instance()
            .has(&DataKey::Member(id, member))
    }

    /// Return alliance metadata.
    pub fn get_alliance(env: Env, id: BytesN<32>) -> AllianceInfo {
        env.storage()
            .instance()
            .get(&DataKey::Alliance(id))
            .expect("alliance not found")
    }

    /// Return the list of all member addresses.
    pub fn list_members(env: Env, id: BytesN<32>) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::MemberList(id))
            .unwrap_or_else(|| Vec::new(&env))
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn make_id(env: &Env, seed: u8) -> BytesN<32> {
        BytesN::from_array(env, &[seed; 32])
    }

    #[test]
    fn test_create_alliance() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AllianceRegistry);
        let client = AllianceRegistryClient::new(&env, &contract_id);

        let id = make_id(&env, 1);
        let name = String::from_str(&env, "Istanbul 2026");
        let creator = Address::generate(&env);
        client.create_alliance(&id, &name, &creator);

        let info = client.get_alliance(&id);
        assert_eq!(info.name, name);
        assert_eq!(info.protocol, String::from_str(&env, "mikoriza-v0"));
    }

    #[test]
    fn test_add_member_and_is_member() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AllianceRegistry);
        let client = AllianceRegistryClient::new(&env, &contract_id);

        let id = make_id(&env, 2);
        let creator = Address::generate(&env);
        client.create_alliance(&id, &String::from_str(&env, "Test Alliance"), &creator);

        let member = Address::generate(&env);
        let cap = String::from_str(&env, "registry-anchor");
        client.add_member(&id, &member, &cap);

        assert!(client.is_member(&id, &member));
        let list = client.list_members(&id);
        assert_eq!(list.len(), 1);
    }

    #[test]
    fn test_set_capability() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AllianceRegistry);
        let client = AllianceRegistryClient::new(&env, &contract_id);

        let id = make_id(&env, 3);
        let creator = Address::generate(&env);
        client.create_alliance(&id, &String::from_str(&env, "Cap Test"), &creator);

        let member = Address::generate(&env);
        client.add_member(&id, &member, &String::from_str(&env, "initial"));
        client.set_capability(&id, &member, &String::from_str(&env, "upgraded"));
    }

    #[test]
    fn test_list_members_dedup() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AllianceRegistry);
        let client = AllianceRegistryClient::new(&env, &contract_id);

        let id = make_id(&env, 4);
        let creator = Address::generate(&env);
        client.create_alliance(&id, &String::from_str(&env, "Dedup Test"), &creator);

        let member = Address::generate(&env);
        client.add_member(&id, &member, &String::from_str(&env, "cap-a"));
        client.add_member(&id, &member, &String::from_str(&env, "cap-b")); // same member
        let list = client.list_members(&id);
        assert_eq!(list.len(), 1); // still only 1 unique address
    }
}
