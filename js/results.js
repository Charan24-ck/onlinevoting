// Election results and chart

function loadResults() {

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


      const sorted =
        [...candidates].sort(
          function (a,b) {

            return (
              b.votes -
              a.votes
            );

          }
        );


      const table =
        document.getElementById(
          "results-table"
        );


      table.innerHTML = "";


      sorted.forEach(
        function (candidate) {

          const percentage =
            votes.length > 0
              ? (
                  candidate.votes /
                  votes.length *
                  100
                ).toFixed(2)
              : "0.00";


          table.innerHTML += `

            <tr>

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
                ${candidate.votes}
              </td>

              <td>
                ${percentage}%
              </td>

            </tr>

          `;

        }
      );


      updateResultsChart(
        sorted,
        votes.length
      );

    }


    /* =====================================
       CHART
    ===================================== */

function updateResultsChart(
      candidates,
      totalVotes
    ) {

      const canvas =
        document.getElementById(
          "results-chart"
        );


      if (!canvas) {

        return;

      }


      const ctx =
        canvas.getContext(
          "2d"
        );


      if (
        resultsChart
      ) {

        resultsChart.destroy();

      }


      resultsChart =
        new Chart(
          ctx,
          {

            type:
              "bar",


            data: {

              labels:
                candidates.map(
                  function (candidate) {

                    return candidate.name;

                  }
                ),


              datasets: [

                {

                  label:
                    "Votes",

                  data:
                    candidates.map(
                      function (candidate) {

                        return candidate.votes;

                      }
                    ),


                  backgroundColor: [

                    "#4e73df",

                    "#1cc88a",

                    "#f6c23e",

                    "#e74a3b",

                    "#5a5c69"

                  ]

                }

              ]

            },


            options: {

              responsive:
                true,

              maintainAspectRatio:
                false,


              scales: {

                y: {

                  beginAtZero:
                    true,

                  ticks: {

                    precision:
                      0

                  }

                }

              },


              plugins: {

                tooltip: {

                  callbacks: {

                    label:
                      function (context) {

                        const value =
                          context.raw;


                        const percentage =
                          totalVotes > 0
                            ? (
                                value /
                                totalVotes *
                                100
                              ).toFixed(2)
                            : "0.00";


                        return (
                          value +
                          " votes (" +
                          percentage +
                          "%)"
                        );

                      }

                  }

                }

              }

            }

          }
        );

    }


    /* =====================================
       ADMIN DATA
    ===================================== */
