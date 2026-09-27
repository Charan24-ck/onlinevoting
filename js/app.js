// SecureVote application bootstrap

let resultsChart = null;

    let countdownInterval = null;


    /*
      IMPORTANT:

      New version number.
      Old localStorage data will be cleared
      one time.
    */

    const SYSTEM_VERSION =
      "securevote-election-control-v4";

document.addEventListener(
      "DOMContentLoaded",
      function () {

        initializeSystem();

        setupEventListeners();

        loadCurrentView();

        updateDashboardStats();

        loadCandidatesForVoting();

        loadResults();

        updateBlockchainUI();

        startCountdown();

      }
    );

function setupEventListeners() {


      /* SIDEBAR */

      document
        .querySelectorAll(
          ".sidebar-menu a"
        )
        .forEach(
          function (link) {

            link.addEventListener(
              "click",
              function (event) {

                event.preventDefault();


                const viewId =
                  this.id.replace(
                    "-tab",
                    ""
                  );


                if (
                  viewId === "logout"
                ) {

                  logout();

                  return;

                }


                showView(
                  viewId
                );

              }
            );

          }
        );


      /* ADMIN TABS */

      document
        .querySelectorAll(
          ".tab[data-tab]"
        )
        .forEach(
          function (tab) {

            tab.addEventListener(
              "click",
              function () {

                const tabId =
                  this.getAttribute(
                    "data-tab"
                  );


                document
                  .querySelectorAll(
                    ".tab[data-tab]"
                  )
                  .forEach(
                    function (item) {

                      item.classList.remove(
                        "active"
                      );

                    }
                  );


                this.classList.add(
                  "active"
                );


                document
                  .querySelectorAll(
                    "#admin-content .tab-content"
                  )
                  .forEach(
                    function (content) {

                      content.classList.remove(
                        "active"
                      );

                    }
                  );


                document
                  .getElementById(
                    "admin-" +
                    tabId
                  )
                  .classList.add(
                    "active"
                  );

              }
            );

          }
        );


      /* ADMIN LOGIN */

      document
        .getElementById(
          "admin-login-form"
        )
        .addEventListener(
          "submit",
          function (event) {

            event.preventDefault();


            const username =
              document.getElementById(
                "admin-username"
              ).value;


            const password =
              document.getElementById(
                "admin-password"
              ).value;


            const savedUsername =
              localStorage.getItem(
                "admin_username"
              );


            const savedPassword =
              localStorage.getItem(
                "admin_password"
              );


            if (
              username ===
                savedUsername &&
              password ===
                savedPassword
            ) {

              localStorage.setItem(
                "admin_logged_in",
                "true"
              );


              hideLoginModal();


              showView(
                "admin"
              );

            } else {

              alert(
                "Invalid username or password."
              );

            }

          }
        );


      /* ADD CANDIDATE */

      document
        .getElementById(
          "add-candidate-btn"
        )
        .addEventListener(
          "click",
          showCandidateModal
        );


      /* CANCEL CANDIDATE */

      document
        .getElementById(
          "cancel-candidate-btn"
        )
        .addEventListener(
          "click",
          hideCandidateModal
        );


      /* CANDIDATE FORM */

      document
        .getElementById(
          "candidate-form"
        )
        .addEventListener(
          "submit",
          function (event) {

            event.preventDefault();

            addCandidate();

          }
        );


      /* ELECTION SETTINGS */

      document
        .getElementById(
          "election-settings"
        )
        .addEventListener(
          "submit",
          function (event) {

            event.preventDefault();

            saveElectionSettings();

          }
        );


      /* STOP ELECTION */

      document
        .getElementById(
          "stop-election-btn"
        )
        .addEventListener(
          "click",
          stopElection
        );


      /* START ELECTION */

      document
        .getElementById(
          "start-election-btn"
        )
        .addEventListener(
          "click",
          startElection
        );


      /* VERIFY BLOCKCHAIN */

      document
        .getElementById(
          "verify-blockchain-btn"
        )
        .addEventListener(
          "click",
          function () {

            const valid =
              verifyBlockchain();


            if (valid) {

              alert(
                "Blockchain integrity verified successfully!"
              );

            } else {

              alert(
                "Blockchain integrity check failed!"
              );

            }

          }
        );

    }


    /* =====================================
       DASHBOARD STATS
    ===================================== */
