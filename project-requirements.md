
# Project Requirements

*For user stories, see [user-stories.md](./user-stories.md).*

- The backend is managed with Supabase (PostgreSQL, authentication, API).
- The frontend is a React web app (Vite, TypeScript) designed to be responsive for both mobile and desktop users.
- All code and UI must be accessible and user-friendly for older adults.
- Place all backend documentation and SQL scripts in the `/backend` folder.
- Frontend code is in the root directory (Vite + React + TypeScript scaffold).

# Objectives
- Bring in a layer of standardization of services through use of technology
- Use technology to bring operational efficiency in areas like housekeeping
- Improve satisfaction of the end customers of the service, the retirees and their families by providing them better access to the services
- Improve productivity by leveraging technology for repetitive tasks like scheduling and inspection

# Target Audience

- Owners - of retirement community
- Managers - staff of retirement community to manage day to day operation
- Staff - Lower level staff
- Residents - residents of retirement community
- Relatives - relatives of the community
- Platform Administrators - super users who can manage all the communities

# MVP (Minimal Viable Product) Scope
- Establish technology architecture
  - multi tenant
  - multi lingual capability
  - data security
  - access to functionality based on role
- Data Structure - scalable, extensible
- Capture of core data 
  - Customer
  - Community
  - Resident
  - Staff
- Basic housekeeping functionality 
  - Cleaning schedule
  - Tracking
  - Feedback
- Meal tracking
  - Logging
  - Modification requests
  - Notification
- Billing
  - Invoice generation
  - Payment
- Messages and notifications
  - Broadcast messages
- Helpdesk
  - Raise requests
  - Update requests
  - Comment and feedback on request

# Features to be created
At a high level, the features in the MVP relate to
- Customer Onboarding, Creation and Maintenance - ability to create and maintain customers and onboard users to give them access to the system
- User and Role Creation - ability to assign users to roles to make functions available to them
- Community information, resident information,  mapping - ability to specify and maintain information about the community and the residents (who lives where)
- Staff Maintenance, housekeeping schedules - ability to have different staff members details on the system and assigning of tasks
- Meal modification - ability for the residents to request a change in meal service and reporting by the manager
- Messaging to community - ability for the management to send out broadcast messages to all the community members
- Request lifecycle - creating, modifying, assigning of requests