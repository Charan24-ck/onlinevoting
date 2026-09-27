// Admin data, election controls, authentication, and modals

function loadAdminData() {

      if (
        !isAdmin()
      ) {

        return;

      }


      /*
        VOTERS
      */

      const voters =
        JSON.parse(
          localStorage.getItem(
            "voters"
          )
        );


      const votersTable =
        document.getElementById(
          "voters-table"
        );


      votersTable.innerHTML = "";


      voters.forEach(
        function (voter) {

          votersTable.innerHTML += `

            <tr>

              <td>
                ${voter.id}
              </td>

              <td>
                ${escapeHTML(
                  voter.name
                )}
              </td>

              <td>
                ${escapeHTML(
                  voter.email
                )}
              </td>

              <td>

                <span
                  class="badge ${
                    voter.status ===
                    "active"
                      ? "badge-success"
                      : "badge-danger"
                  }"
                >

                  ${voter.status}

                </span>

              </td>

              <td>
                ${(voter.votesCast || 0)}/${
                  (JSON.parse(localStorage.getItem("electionSettings")) || {}).maxVotesPerVoter || 1
                }
              </td>

            </tr>

          `;

        }
      );


      /*
        CANDIDATES
      */

      const candidates =
        JSON.parse(
          localStorage.getItem(
            "candidates"
          )
        );


      const candidatesTable =
        document.getElementById(
          "candidates-admin-table"
        );


      candidatesTable.innerHTML = "";


      candidates.forEach(
        function (candidate) {

          candidatesTable.innerHTML += `

            <tr>

              <td>
                ${candidate.id}
              </td>

              <td>
                ${escapeHTML(
                  candidate.name
                )}
              </td>

              <td>
                ${escapeHTML(
                  candidate.party
                )}
              </td>

              <td>
                ${escapeHTML(
                  candidate.position
                )}
              </td>

              <td>
                ${candidate.votes}
              </td>

              <td>
                <button
                  class="btn btn-primary edit-candidate-btn"
                  data-id="${candidate.id}"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                  Edit
                </button>
              </td>

            </tr>

          `;

        }
      );


      document
        .querySelectorAll(".edit-candidate-btn")
        .forEach(function (button) {

          button.addEventListener(
            "click",
            function () {

              editCandidate(
                Number(this.getAttribute("data-id"))
              );

            }
          );

        });


      /*
        VOTES
      */

      const votes =
        JSON.parse(
          localStorage.getItem(
            "votes"
          )
        );


      const votesTable =
        document.getElementById(
          "votes-table"
        );


      votesTable.innerHTML = "";


      votes.forEach(
        function (vote) {

          votesTable.innerHTML += `

            <tr>

              <td>
                ${vote.id}
              </td>

              <td>
                ${escapeHTML(
                  vote.voterName
                )}
              </td>

              <td>
                ${escapeHTML(
                  vote.candidateName
                )}
              </td>

              <td>
                ${new Date(
                  vote.timestamp
                ).toLocaleString()}
              </td>

              <td>

                <small>
                  ${vote.blockHash || "N/A"}
                </small>

              </td>

            </tr>

          `;

        }
      );


      /*
        ELECTION SETTINGS
      */

      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      document.getElementById(
        "election-title"
      ).value =
        settings.title;


      document.getElementById(
        "election-start"
      ).value =
        formatDateTimeForInput(
          new Date(
            settings.start
          )
        );


      document.getElementById(
        "election-end"
      ).value =
        formatDateTimeForInput(
          new Date(
            settings.end
          )
        );


      document.getElementById(
        "election-status"
      ).value =
        settings.status;


      const maxVotesInput =
        document.getElementById(
          "max-votes-per-voter"
        );

      if (maxVotesInput) {

        maxVotesInput.value =
          settings.maxVotesPerVoter || 1;

      }


      updateAdminStatus(
        settings.status
      );


      updateBlockchainUI();

    }


    /* =====================================
       ADMIN STATUS
    ===================================== */

function updateAdminStatus(
      status
    ) {

      const statusText =
        document.getElementById(
          "admin-current-status"
        );


      const statusBox =
        document.getElementById(
          "admin-status-box"
        );


      if (!statusText ||
          !statusBox) {

        return;

      }


      statusText.textContent =
        status.toUpperCase();


      statusBox.className =
        "status-box";


      if (
        status === "active"
      ) {

        statusBox.classList.add(
          "status-active"
        );

      }
      else if (
        status === "stopped"
      ) {

        statusBox.classList.add(
          "status-stopped"
        );

      }
      else {

        statusBox.classList.add(
          "status-completed"
        );

      }

    }


    /* =====================================
       ADD CANDIDATE
    ===================================== */

function addCandidate() {

      const idInput =
        document.getElementById("candidate-id");

      const existingId =
        Number(idInput.value);

      const name =
        document.getElementById("candidate-name").value.trim();

      const party =
        document.getElementById("candidate-party").value.trim();

      const position =
        document.getElementById("candidate-position").value.trim();

      const bio =
        document.getElementById("candidate-bio").value.trim();

      const image =
        document.getElementById("candidate-image").value.trim() ||
        "https://via.placeholder.com/300";

      if (!name || !party || !position) {

        alert("Please fill all required fields.");
        return;

      }

      const candidates =
        JSON.parse(localStorage.getItem("candidates")) || [];

      /* EDIT EXISTING CANDIDATE */
      if (existingId) {

        const candidate =
          candidates.find(function (item) {
            return item.id === existingId;
          });

        if (!candidate) {
          alert("Candidate not found.");
          return;
        }

        candidate.name = name;
        candidate.party = party;
        candidate.position = position;
        candidate.bio = bio;
        candidate.image = image;

        localStorage.setItem(
          "candidates",
          JSON.stringify(candidates)
        );

        hideCandidateModal();
        loadCandidatesForVoting();
        loadResults();
        updateDashboardStats();
        loadAdminData();

        alert("Candidate details updated successfully!");
        return;

      }

      /* ADD NEW CANDIDATE */
      const newId =
        candidates.length > 0
          ? Math.max(...candidates.map(function (candidate) {
              return candidate.id;
            })) + 1
          : 1;

      candidates.push({
        id: newId,
        name: name,
        party: party,
        position: position,
        bio: bio,
        image: image,
        votes: 0
      });

      localStorage.setItem(
        "candidates",
        JSON.stringify(candidates)
      );

      hideCandidateModal();
      loadCandidatesForVoting();
      loadResults();
      updateDashboardStats();
      loadAdminData();

      alert("Candidate added successfully!");

    }


    /* =====================================
       EDIT CANDIDATE
    ===================================== */

function editCandidate(candidateId) {

      const candidates =
        JSON.parse(localStorage.getItem("candidates")) || [];

      const candidate =
        candidates.find(function (item) {
          return item.id === candidateId;
        });

      if (!candidate) {
        alert("Candidate not found.");
        return;
      }

      document.getElementById("candidate-id").value = candidate.id;
      document.getElementById("candidate-name").value = candidate.name || "";
      document.getElementById("candidate-party").value = candidate.party || "";
      document.getElementById("candidate-position").value = candidate.position || "President";
      document.getElementById("candidate-bio").value = candidate.bio || "";
      document.getElementById("candidate-image").value = candidate.image || "";

      document.getElementById("candidate-modal-title").textContent =
        "Edit Candidate";

      document
        .getElementById("candidate-modal")
        .classList.add("active");

    }


    /* =====================================
       SAVE ELECTION SETTINGS
    ===================================== */

function saveElectionSettings() {

      const title =
        document.getElementById(
          "election-title"
        ).value.trim();


      const start =
        document.getElementById(
          "election-start"
        ).value;


      const end =
        document.getElementById(
          "election-end"
        ).value;


      const status =
        document.getElementById(
          "election-status"
        ).value;


      const maxVotesPerVoter =
        Number(
          document.getElementById(
            "max-votes-per-voter"
          ).value
        );


      if (
        !title ||
        !start ||
        !end ||
        !Number.isInteger(maxVotesPerVoter) ||
        maxVotesPerVoter < 1 ||
        maxVotesPerVoter > 10
      ) {

        alert(
          "Please fill all required fields."
        );

        return;

      }


      const startDate =
        new Date(start);


      const endDate =
        new Date(end);


      if (
        endDate <=
        startDate
      ) {

        alert(
          "End date must be after start date."
        );

        return;

      }


      const settings = {

        title:
          title,

        start:
          startDate.toISOString(),

        end:
          endDate.toISOString(),

        status:
          status,

        maxVotesPerVoter:
          maxVotesPerVoter

      };


      localStorage.setItem(
        "electionSettings",
        JSON.stringify(
          settings
        )
      );


      loadCandidatesForVoting();

      loadAdminData();

      startCountdown();


      alert(
        "Election settings saved successfully!"
      );

    }


    /* =====================================
       STOP ELECTION
    ===================================== */

function stopElection() {

      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      if (!settings) {

        alert(
          "Election settings not found."
        );

        return;

      }


      if (
        settings.status ===
        "stopped"
      ) {

        alert(
          "Election is already stopped."
        );

        return;

      }


      if (
        settings.status ===
        "completed"
      ) {

        alert(
          "Completed election cannot be stopped."
        );

        return;

      }


      const confirmed =
        confirm(
          "Are you sure you want to STOP the election?"
        );


      if (!confirmed) {

        return;

      }


      /*
        ONLY STATUS CHANGES

        Existing votes are NOT deleted.
      */

      settings.status =
        "stopped";


      localStorage.setItem(
        "electionSettings",
        JSON.stringify(
          settings
        )
      );


      /*
        REFRESH EVERYTHING
      */

      loadCandidatesForVoting();

      loadAdminData();

      updateDashboardStats();

      startCountdown();


      alert(
        "Election stopped successfully.\n\nVoting is now paused."
      );

    }


    /* =====================================
       START ELECTION
    ===================================== */

function startElection() {

      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      if (!settings) {

        alert(
          "Election settings not found."
        );

        return;

      }


      if (
        settings.status ===
        "active"
      ) {

        alert(
          "Election is already active."
        );

        return;

      }


      if (
        settings.status ===
        "completed"
      ) {

        alert(
          "Completed election cannot be restarted.\n\n" +
          "Change the status to Active in settings if you want to create a new election."
        );

        return;

      }


      const confirmed =
        confirm(
          "Are you sure you want to START the election?"
        );


      if (!confirmed) {

        return;

      }


      const now =
        new Date();


      /*
        If old end date is already passed,
        give a new 7-day period.
      */

      if (
        new Date(
          settings.end
        ) <= now
      ) {

        const newEnd =
          new Date();


        newEnd.setDate(
          newEnd.getDate() + 7
        );


        settings.end =
          newEnd.toISOString();

      }


      /*
        Start immediately
      */

      settings.start =
        now.toISOString();


      settings.status =
        "active";


      localStorage.setItem(
        "electionSettings",
        JSON.stringify(
          settings
        )
      );


      /*
        REFRESH
      */

      loadCandidatesForVoting();

      loadAdminData();

      updateDashboardStats();

      startCountdown();


      alert(
        "Election started successfully!\n\nVoting is now LIVE."
      );

    }


    /* =====================================
       ADMIN CHECK
    ===================================== */

function isAdmin() {

      return (
        localStorage.getItem(
          "admin_logged_in"
        ) === "true"
      );

    }


    /* =====================================
       LOGIN MODAL
    ===================================== */

function showLoginModal() {

      document
        .getElementById(
          "login-modal"
        )
        .classList.add(
          "active"
        );

    }

function hideLoginModal() {

      document
        .getElementById(
          "login-modal"
        )
        .classList.remove(
          "active"
        );


      document
        .getElementById(
          "admin-login-form"
        )
        .reset();

    }


    /* =====================================
       LOGOUT
    ===================================== */

function logout() {

      localStorage.removeItem(
        "admin_logged_in"
      );


      showView(
        "dashboard"
      );


      alert(
        "Logged out successfully."
      );

    }


    /* =====================================
       CANDIDATE MODAL
    ===================================== */

function showCandidateModal() {

      document
        .getElementById("candidate-form")
        .reset();

      document
        .getElementById("candidate-id")
        .value = "";

      document
        .getElementById("candidate-modal-title")
        .textContent = "Add Candidate";

      document
        .getElementById("candidate-modal")
        .classList.add("active");

    }

function hideCandidateModal() {

      document
        .getElementById("candidate-modal")
        .classList.remove("active");

      document
        .getElementById("candidate-id")
        .value = "";

      document
        .getElementById("candidate-modal-title")
        .textContent = "Add Candidate";

    }


    /* =====================================
       DATE FORMAT
    ===================================== */

function formatDateTimeForInput(
      date
    ) {

      const year =
        date.getFullYear();


      const month =
        String(
          date.getMonth() + 1
        ).padStart(
          2,
          "0"
        );


      const day =
        String(
          date.getDate()
        ).padStart(
          2,
          "0"
        );


      const hours =
        String(
          date.getHours()
        ).padStart(
          2,
          "0"
        );


      const minutes =
        String(
          date.getMinutes()
        ).padStart(
          2,
          "0"
        );


      return (
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hours +
        ":" +
        minutes
      );

    }


    /* =====================================
       COUNTDOWN
    ===================================== */
