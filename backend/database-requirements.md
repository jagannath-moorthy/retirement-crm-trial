``` markdown


**Entities in SaaS for Retirement Communities**

**1. Client**

Represents the primary customer of the service, typically a legal entity operating one or more retirement communities.

**Fields:**

*   id – Unique identifier
*   name – Client’s official name
*   contact_info – Email, phone, website
*   status – Enum: **Lead, In Discussion, Confirmed, Active, Inactive**
*   subscription_plan_id – Links to the **Subscription Plan** table
*   created_datetime, modified_datetime – Timestamps for tracking changes
*   created_by, modified_by – User responsible for updates

**2. Community**

Represents an individual retirement community managed by a client, maintaining key operational details.

**Fields:**

* **id** – Unique identifier
* **client_id** – Links to the **Client** table
* **name** – Community name
* **address**
    * **address_line1** – First line of the street address
    * **address_line2** – Optional second line for apartments, suites, etc.
    * **address_line3** – Optional third line for additional detail
    * **locality** – City, town, or primary administrative locality
    * **country_subdivision** – State, province, or other regional division
    * **postal_code** – Postal code (can be alphanumeric)
    * **country** – Country (use a standard code like ISO 3166-1)
* **geo_location**
    * **latitude**
    * **longitude**
* **status** – Enum: `Active`, `Inactive`
* **onboarding_status** – Enum: `Setup Required`, `Data Import`, `Staff Training`, `Live`
* **manager_id** – Links to **Community_User** to identify the assigned manager
* **timezone** – Community's specific timezone
* **contact_email** – Community's primary contact email
* **contact_phone** – Community's primary contact phone number
* **logo_url** – URL to the community's logo for branding
* **onboarding_date** – Date when the community went live on the platform
* **created_datetime, modified_datetime** – Timestamps for tracking changes
* **created_by, modified_by** – User responsible for updates

**3. Unit**

Represents the smallest part of a community, typically owned or rented by residents.

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table
*   unit_number – Unique identifier within the community
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates

**4. Facility**

Represents physical spaces within a community that residents can access.

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table
*   name – Facility name (e.g., Gym, Lounge, Dining Hall)
*   type – Enum: **Public, Private, Special Access**
*   capacity – Maximum occupancy
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates

**5. Service**

Represents an operational offering provided by the community (e.g., meal plans, housekeeping).

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table
*   name – Service name (e.g., Housekeeping, Meals, Medical)
*   description – Brief summary
*   cost_structure – Enum: **Flat fee, per-use, included in plan**
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates

**6. Community_User**

Manages associations between users and communities, handling roles, unit assignments, and relationships.

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table
*   user_id – Links to a **global User table** (if required for authentication)
*   unit_id – Links to the **Unit** table (if the user resides in a unit)
*   role_type – Enum: **Resident, Owner, Manager, Staff, Interested Party**
*   relationship_type – Enum: **Primary Resident, Co-Resident, Emergency Contact, Vendor**
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates

**7. Role-Based Access**

Defines permissions per role to control system functionalities.

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table (ensuring role assignments are community-specific)
*   user_id – Links to the **Community_User** table (associating a role with a specific user)
*   role_type – Enum: **Owner, Manager, Staff, Resident, Interested Party**
*   permissions – JSON mapping allowed actions
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates

**8. Requests**

Tracks maintenance issues, resident concerns, or service requests.

**Fields:**

*   id – Unique identifier
*   community_id – Links to the **Community** table
*   user_id – Links to the **Community_User** table
*   request_type – Enum: **Maintenance, Medical, General**
*   status – Enum: **Open, In Progress, Completed**
*   assigned_staff_id – Tracks responsible personnel
*   created_datetime, modified_datetime – Timestamps
*   created_by, modified_by – User responsible for updates


```