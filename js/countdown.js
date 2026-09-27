// Election countdown and time formatting

function startCountdown() {

      if (
        countdownInterval
      ) {

        clearInterval(
          countdownInterval
        );

      }


      const settings =
        JSON.parse(
          localStorage.getItem(
            "electionSettings"
          )
        );


      if (!settings) {

        return;

      }


      const start =
        new Date(
          settings.start
        );


      const end =
        new Date(
          settings.end
        );

function updateCountdown() {

        const currentSettings =
          JSON.parse(
            localStorage.getItem(
              "electionSettings"
            )
          );


        const now =
          new Date();


        const timeElement =
          document.getElementById(
            "time-remaining"
          );


        const badge =
          document.getElementById(
            "election-status-badge"
          );


        /*
          STOPPED

          Important:
          Stop should NOT show ended.
        */

        if (
          currentSettings.status ===
          "stopped"
        ) {

          timeElement.textContent =
            "PAUSED";


          badge.textContent =
            "Paused";


          badge.className =
            "badge badge-warning";


          return;

        }


        /*
          COMPLETED
        */

        if (
          currentSettings.status ===
          "completed"
        ) {

          timeElement.textContent =
            "ENDED";


          badge.textContent =
            "Completed";


          badge.className =
            "badge badge-danger";


          return;

        }


        const currentStart =
          new Date(
            currentSettings.start
          );


        const currentEnd =
          new Date(
            currentSettings.end
          );


        /*
          UPCOMING
        */

        if (
          now <
          currentStart
        ) {

          const difference =
            currentStart -
            now;


          updateTimeDisplay(
            difference,
            timeElement
          );


          badge.textContent =
            "Upcoming";


          badge.className =
            "badge badge-warning";


          return;

        }


        /*
          END
        */

        if (
          now >=
          currentEnd
        ) {

          timeElement.textContent =
            "00:00:00";


          badge.textContent =
            "Ended";


          badge.className =
            "badge badge-danger";


          /*
            Automatically mark completed
          */

          if (
            currentSettings.status ===
            "active"
          ) {

            currentSettings.status =
              "completed";


            localStorage.setItem(
              "electionSettings",
              JSON.stringify(
                currentSettings
              )
            );


            loadCandidatesForVoting();

            updateAdminStatus(
              "completed"
            );

          }


          return;

        }


        /*
          ACTIVE
        */

        const difference =
          currentEnd -
          now;


        updateTimeDisplay(
          difference,
          timeElement
        );


        badge.textContent =
          "Live";


        badge.className =
          "badge badge-success";

      }


      updateCountdown();


      countdownInterval =
        setInterval(
          updateCountdown,
          1000
        );

    }


    /* =====================================
       TIME DISPLAY
    ===================================== */

function updateTimeDisplay(
      difference,
      element
    ) {

      const hours =
        Math.floor(
          difference /
          (1000 * 60 * 60)
        );


      const minutes =
        Math.floor(
          (
            difference %
            (1000 * 60 * 60)
          ) /
          (1000 * 60)
        );


      const seconds =
        Math.floor(
          (
            difference %
            (1000 * 60)
          ) /
          1000
        );


      element.textContent =
        String(hours)
          .padStart(2,"0") +
        ":" +
        String(minutes)
          .padStart(2,"0") +
        ":" +
        String(seconds)
          .padStart(2,"0");

    }


    /* =====================================
       BLOCKCHAIN UI
    ===================================== */

function escapeHTML(
      value
    ) {

      return String(value)

        .replace(
          /&/g,
          "&amp;"
        )

        .replace(
          /</g,
          "&lt;"
        )

        .replace(
          />/g,
          "&gt;"
        )

        .replace(
          /"/g,
          "&quot;"
        )

        .replace(
          /'/g,
          "&#039;"
        );

    }
