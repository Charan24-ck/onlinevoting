// Candidate loading and vote casting

function loadCandidatesForVoting() {

      const candidates =
        JSON.parse(
          localStorage.getItem(
            "candidates"
          )
        );


      const voters =
        JSON.parse(
          localStorage.getItem(
            "voters"
          )
        );


      const currentVoter =
        voters[0];


      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      const maxVotes =
        Number(settings.maxVotesPerVoter) || 1;

      if (typeof currentVoter.votesCast !== "number") {

        currentVoter.votesCast =
          currentVoter.voted ? maxVotes : 0;

      }

      currentVoter.voted =
        currentVoter.votesCast >= maxVotes;

      localStorage.setItem(
        "voters",
        JSON.stringify(voters)
      );


      document.getElementById(
        "election-title-display"
      ).textContent =
        settings.title;


      const now =
        new Date();


      const start =
        new Date(
          settings.start
        );


      const end =
        new Date(
          settings.end
        );


      /*
        IMPORTANT:

        Vote allowed ONLY when
        status = active
      */

      const canVote =
        settings.status === "active" &&
        now >= start &&
        now <= end;


      /*
        STATUS BADGE
      */

      const badge =
        document.getElementById(
          "election-status-badge"
        );


      const message =
        document.getElementById(
          "voting-message"
        );


      if (
        settings.status ===
        "active"
      ) {

        badge.textContent =
          "Live";

        badge.className =
          "badge badge-success";

        message.textContent =
          currentVoter.voted
            ? "You have used all your allowed votes for this election."
            : "Please select your preferred candidate. Votes remaining: " +
              (maxVotes - currentVoter.votesCast);

      }
      else if (
        settings.status ===
        "stopped"
      ) {

        badge.textContent =
          "Paused";

        badge.className =
          "badge badge-warning";

        message.textContent =
          "Voting has been temporarily stopped by the administrator.";

      }
      else if (
        settings.status ===
        "completed"
      ) {

        badge.textContent =
          "Completed";

        badge.className =
          "badge badge-danger";

        message.textContent =
          "This election has been completed.";

      }
      else {

        badge.textContent =
          "Upcoming";

        badge.className =
          "badge badge-warning";

        message.textContent =
          "Voting has not started yet.";

      }


      const list =
        document.getElementById(
          "candidates-list"
        );


      list.innerHTML = "";


      candidates.forEach(
        function (candidate) {


          let buttonText =
            "Vote Now";


          if (
            currentVoter.voted
          ) {

            buttonText =
              "No Votes Remaining";

          }
          else if (
            settings.status ===
            "stopped"
          ) {

            buttonText =
              "Voting Paused";

          }
          else if (
            settings.status ===
            "completed"
          ) {

            buttonText =
              "Election Completed";

          }
          else if (
            !canVote
          ) {

            buttonText =
              "Voting Not Available";

          }


          const disabled =
            currentVoter.voted ||
            !canVote;


          list.innerHTML += `

            <div
              class="candidate-card"
            >


              <div
                class="candidate-img"
              >

                <img
                  src="${escapeHTML(
                    candidate.image
                  )}"
                  alt="${escapeHTML(
                    candidate.name
                  )}"
                >

              </div>


              <div
                class="candidate-info"
              >

                <h4>
                  ${escapeHTML(
                    candidate.name
                  )}
                </h4>


                <p>

                  <strong>
                    ${escapeHTML(
                      candidate.party
                    )}
                  </strong>

                  -

                  ${escapeHTML(
                    candidate.position
                  )}

                </p>


                <p>
                  ${escapeHTML(
                    candidate.bio
                  )}
                </p>


                <button
                  class="vote-btn"
                  data-id="${candidate.id}"
                  ${disabled
                    ? "disabled"
                    : ""}
                >

                  ${buttonText}

                </button>

              </div>

            </div>

          `;

        }
      );


      /*
        VOTE BUTTON EVENTS
      */

      document
        .querySelectorAll(
          ".vote-btn"
        )
        .forEach(
          function (button) {

            button.addEventListener(
              "click",
              function () {

                const candidateId =
                  Number(
                    this.getAttribute(
                      "data-id"
                    )
                  );


                castVote(
                  candidateId
                );

              }
            );

          }
        );

    }


    /* =====================================
       CAST VOTE
    ===================================== */

function castVote(
      candidateId
    ) {


      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      /*
        IMPORTANT SECURITY CHECK

        Even if somebody tries to
        call function manually,
        stopped election cannot accept vote.
      */

      if (
        settings.status !==
        "active"
      ) {

        alert(
          "Voting is currently not active."
        );

        return;

      }


      const now =
        new Date();


      if (
        now <
        new Date(
          settings.start
        )
      ) {

        alert(
          "Voting has not started yet."
        );

        return;

      }


      if (
        now >
        new Date(
          settings.end
        )
      ) {

        alert(
          "Voting has ended."
        );

        return;

      }


      const voters =
        JSON.parse(
          localStorage.getItem(
            "voters"
          )
        );


      const candidates =
        JSON.parse(
          localStorage.getItem(
            "candidates"
          )
        );


      const votes =
        JSON.parse(
          localStorage.getItem(
            "votes"
          )
        );


      const voter =
        voters[0];


      /*
        MAXIMUM VOTES PER VOTER
      */

      const maxVotes =
        Number(settings.maxVotesPerVoter) || 1;

      if (typeof voter.votesCast !== "number") {

        voter.votesCast =
          voter.voted ? maxVotes : 0;

      }

      if (
        voter.votesCast >= maxVotes
      ) {

        alert(
          "You have used all " +
          maxVotes +
          " allowed vote(s)."
        );

        return;

      }


      const candidate =
        candidates.find(
          function (item) {

            return (
              item.id ===
              candidateId
            );

          }
        );


      if (!candidate) {

        alert(
          "Candidate not found."
        );

        return;

      }


      /*
        CREATE VOTE
      */

      const vote = {

        id:
          votes.length + 1,

        voterId:
          voter.id,

        voterName:
          voter.name,

        candidateId:
          candidate.id,

        candidateName:
          candidate.name,

        timestamp:
          new Date().toISOString()

      };


      /*
        UPDATE CANDIDATE
      */

      candidate.votes += 1;


      /*
        UPDATE VOTER
      */

      voter.votesCast =
        (voter.votesCast || 0) + 1;

      voter.voted =
        voter.votesCast >= maxVotes;


      /*
        ADD BLOCKCHAIN BLOCK
      */

      const block =
        addBlockToChain(
          vote
        );


      /*
        SAVE BLOCK HASH
      */

      vote.blockHash =
        block.hash;


      /*
        SAVE VOTE
      */

      votes.push(
        vote
      );


      localStorage.setItem(
        "votes",
        JSON.stringify(
          votes
        )
      );


      localStorage.setItem(
        "candidates",
        JSON.stringify(
          candidates
        )
      );


      localStorage.setItem(
        "voters",
        JSON.stringify(
          voters
        )
      );


      /*
        UPDATE UI
      */

      loadCandidatesForVoting();

      updateDashboardStats();

      loadResults();

      updateBlockchainUI();


      alert(
        "Vote submitted successfully!\n\n" +
        "Candidate: " +
        candidate.name +
        "\n\n" +
        "Votes used: " +
        voter.votesCast +
        "/" +
        maxVotes
      );

    }


    /* =====================================
       RESULTS
    ===================================== */
