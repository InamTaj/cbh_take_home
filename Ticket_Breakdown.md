# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket #1: Create Mapper table in database to save Id equivalence

**Acceptance Criteria**

- Database should have table that stores internal db Id along with custom Id defined by a Facility
- Support for different custom Ids per Facility should be available
- Adequate cascading rules need to be added to maintain data correctness

**Time/Effort Estimate**

- 1-2 days

**Implementation Details**

- Create IdMapper table with following columns:
  - agent_id (PK)
  - facility_agent_id (Unique, Not Null)
  - facility_id (Not Null)
- Add ON_DELETE cascade rule


### Ticket #2: Build CRUD mechanism for custom Id scheme

**Acceptance Criteria**

- Ability to perform CRUD operations for custom Id scheme via APIs
- Ability to support per-facility custom Id scheme management through APIs

**Time/Effort Estimate**
- 3-5 days (depending on feature complexity)

**Implementation Details**

- (Assumption: Existing system has RESTful APIs) 
- Create new IdMapper service which performs CRUD operations
- POST custom-id/
    - Request payload (facility_id, agent_id, facility_agent_id)
    - Response (OK / 4xx / 5xx errors)
- GET custom-id/
    - Query params (facility_id OR agent_id)
    - Response (valid record / 404)
- PUT custom-id/
    - Request payload (facility_agent_id, new_facility_agent_id)
    - Response (valid record / 404)
      - Note: PUT API has to ensure backward compatibility and make sure all places which uses old Id get updated correctly. Think of 
  generated URL schemes, reports, or if custom Ids are being used in other tables
- DELETE custom-id/
    - Request payload (facility_id, agent_id, facility_agent_id)
    - Response (valid record / 404)
      - Note: DELETE API has to ensure data is properly being cascaded (hard or soft delete, depending on organizational requirements)


### Ticket #3: Update reporting functions to support custom Ids

**Acceptance Criteria**

- Existing functions (`getShiftsByFacility`, `generateReport`) should support custom Ids
- Existing functions should be able to work with internal Ids if custom Ids are not defined

**Time/Effort Estimate**

- 2-3 days

**Implementation Details**

- `getShiftsByFacility` should:
  - return custom ids of agents defined in `IdMapper` table
  - return internal db ids (as per pervious implementation) if custom Ids are not defined
- `generateReport` should generate PDFs by:
  - specifying custom Ids of agents where available, otherwise, it should specify internal db ids
