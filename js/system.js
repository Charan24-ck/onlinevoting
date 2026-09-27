// System initialization and seed data

function initializeSystem() {


      const savedVersion =
        localStorage.getItem(
          "secureVoteVersion"
        );


      /*
        CLEAR OLD DATA ONLY ONCE
      */

      if (
        savedVersion !==
        SYSTEM_VERSION
      ) {

        localStorage.removeItem(
          "blockchain"
        );

        localStorage.removeItem(
          "candidates"
        );

        localStorage.removeItem(
          "voters"
        );

        localStorage.removeItem(
          "votes"
        );

        localStorage.removeItem(
          "electionSettings"
        );

        localStorage.removeItem(
          "admin_logged_in"
        );

        localStorage.removeItem(
          "admin_username"
        );

        localStorage.removeItem(
          "admin_password"
        );


        localStorage.setItem(
          "secureVoteVersion",
          SYSTEM_VERSION
        );

      }


      /*
        IF SYSTEM ALREADY EXISTS
      */

      if (
        localStorage.getItem(
          "blockchain"
        )
      ) {

        return;

      }


      /* =================================
         GENESIS BLOCK
      ================================= */

      const timestamp =
        new Date().toISOString();


      const genesisHash =
        calculateHash(
          0,
          "Genesis Block",
          "0",
          timestamp
        );


      const genesisBlock = {

        index:
          0,

        timestamp:
          timestamp,

        data:
          "Genesis Block",

        previousHash:
          "0",

        hash:
          genesisHash

      };


      localStorage.setItem(
        "blockchain",
        JSON.stringify([
          genesisBlock
        ])
      );


      /* =================================
         CANDIDATES
      ================================= */

      const candidates = [

{
    id: 1,
    name: "John Smith",
    party: "Progressive Party",
    symbol: "🗳️",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW8ZB_8dk0HjZfE7VKMJiTZ4lUzTQQ-9yn0YoYGpKLFQ&s=10",
    votes: 0
},


        {

          id:
            2,

          name:
            "Sarah Johnson",

          party:
            "Republican Party",

          position:
            "President",

          bio:
            "Focused on economic growth and development.",

          image:
            "https://randomuser.me/api/portraits/women/44.jpg",

          votes:
            0

        },


        {

          id:
            3,

          name:
            "Michael Brown",

          party:
            "Green Party",

          position:
            "President",

          bio:
            "Focused on environmental protection.",

          image:
            "https://randomuser.me/api/portraits/men/67.jpg",

          votes:
            0

        }

      ];


      localStorage.setItem(
        "candidates",
        JSON.stringify(
          candidates
        )
      );


      /* =================================
         VOTERS
      ================================= */

      const voters = [

        {

          id:
            1,

          name:
            "John Doe",

          email:
            "john@example.com",

          voted:
            false,

          votesCast:
            0,

          status:
            "active"

        },


        {

          id:
            2,

          name:
            "Jane Smith",

          email:
            "jane@example.com",

          voted:
            false,

          votesCast:
            0,

          status:
            "active"

        },


        {

          id:
            3,

          name:
            "David Kumar",

          email:
            "david@example.com",

          voted:
            false,

          votesCast:
            0,

          status:
            "active"

        }

      ];


      localStorage.setItem(
        "voters",
        JSON.stringify(
          voters
        )
      );


      /* =================================
         VOTES
      ================================= */

      localStorage.setItem(
        "votes",
        JSON.stringify([])
      );


      /* =================================
         ELECTION
      ================================= */

      const start =
        new Date();


      const end =
        new Date();


      end.setDate(
        end.getDate() + 7
      );


      const electionSettings = {

        title:
          "Presidential Election 2026",

        start:
          start.toISOString(),

        end:
          end.toISOString(),

        status:
          "pending",

        maxVotesPerVoter:
          1

      };


      localStorage.setItem(
        "electionSettings",
        JSON.stringify(
          electionSettings
        )
      );


      /* =================================
         ADMIN LOGIN
      ================================= */

      localStorage.setItem(
        "admin_username",
        "admin"
      );


      localStorage.setItem(
        "admin_password",
        "admin123"
      );

    }


    /* =====================================
       HASH
    ===================================== */
