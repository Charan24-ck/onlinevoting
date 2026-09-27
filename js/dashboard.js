// Dashboard statistics and recent activity

function updateDashboardStats() {

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


      document.getElementById(
        "total-voters"
      ).textContent =
        voters.length;


      document.getElementById(
        "total-candidates"
      ).textContent =
        candidates.length;


      document.getElementById(
        "total-votes"
      ).textContent =
        votes.length;


      const progress =
        voters.length > 0
          ? (
              votes.length /
              voters.length
            ) * 100
          : 0;


      document.getElementById(
        "votes-progress"
      ).style.width =
        Math.min(
          100,
          progress
        ) + "%";


      /*
        ACTIVITY
      */

      const activity =
        document.getElementById(
          "recent-activity"
        );


      if (
        votes.length === 0
      ) {

        activity.innerHTML = `

          <p>
            No recent activity yet.
            Cast your vote to see updates here.
          </p>

        `;

      } else {

        activity.innerHTML =
          votes
            .slice()
            .reverse()
            .slice(0,5)
            .map(
              function (vote) {

                return `

                  <div
                    class="activity-item"
                  >

                    <strong>
                      ${escapeHTML(
                        vote.voterName
                      )}
                    </strong>

                    voted for

                    <strong>
                      ${escapeHTML(
                        vote.candidateName
                      )}
                    </strong>

                    <br>

                    <small
                      class="text-gray"
                    >

                      ${new Date(
                        vote.timestamp
                      ).toLocaleString()}

                    </small>

                  </div>

                `;

              }
            )
            .join("");

      }

    }


    /* =====================================
       LOAD CANDIDATES
    ===================================== */
