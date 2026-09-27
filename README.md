# SecureVote 


## Structure

```text
SecureVote_Organized/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── system.js
    ├── blockchain.js
    ├── navigation.js
    ├── dashboard.js
    ├── voting.js
    ├── results.js
    ├── admin.js
    └── countdown.js
```

## Election flow
1. Election starts in Pending / Not Started state.
2. Admin opens Admin Panel and chooses election settings.
3. Admin sets Maximum Votes Per Voter (1-10).
4. Admin clicks Start Election.
5. Voting becomes available only while the election is Active and within the configured time.
6. Each voter can vote up to the configured maximum number of times.

This is a frontend/localStorage demo project, not a production-secure voting system.
