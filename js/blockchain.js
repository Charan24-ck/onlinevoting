// Blockchain hashing, blocks, verification, and UI

function serializeData(data) {

      if (
        typeof data ===
        "string"
      ) {

        return data;

      }


      return JSON.stringify(
        data
      );

    }

function calculateHash(
      index,
      data,
      previousHash,
      timestamp
    ) {

      const input =
        String(index) +
        serializeData(data) +
        String(previousHash) +
        String(timestamp);


      return CryptoJS
        .SHA256(input)
        .toString();

    }


    /* =====================================
       ADD BLOCK
    ===================================== */

function addBlockToChain(
      voteData
    ) {

      const blockchain =
        JSON.parse(
          localStorage.getItem(
            "blockchain"
          )
        );


      const previousBlock =
        blockchain[
          blockchain.length - 1
        ];


      const newIndex =
        previousBlock.index + 1;


      const timestamp =
        new Date().toISOString();


      const newHash =
        calculateHash(
          newIndex,
          voteData,
          previousBlock.hash,
          timestamp
        );


      const newBlock = {

        index:
          newIndex,

        timestamp:
          timestamp,

        data:
          voteData,

        previousHash:
          previousBlock.hash,

        hash:
          newHash

      };


      blockchain.push(
        newBlock
      );


      localStorage.setItem(
        "blockchain",
        JSON.stringify(
          blockchain
        )
      );


      return newBlock;

    }


    /* =====================================
       VERIFY BLOCKCHAIN
    ===================================== */

function verifyBlockchain() {

      const blockchain =
        JSON.parse(
          localStorage.getItem(
            "blockchain"
          )
        );


      if (
        !blockchain ||
        blockchain.length === 0
      ) {

        return false;

      }


      for (
        let i = 0;
        i < blockchain.length;
        i++
      ) {

        const current =
          blockchain[i];


        const calculatedHash =
          calculateHash(
            current.index,
            current.data,
            current.previousHash,
            current.timestamp
          );


        if (
          current.hash !==
          calculatedHash
        ) {

          return false;

        }


        if (
          i > 0
        ) {

          const previous =
            blockchain[i - 1];


          if (
            current.previousHash !==
            previous.hash
          ) {

            return false;

          }

        }

      }


      return true;

    }


    /* =====================================
       NAVIGATION
    ===================================== */

function updateBlockchainUI() {

      const blockchain =
        JSON.parse(
          localStorage.getItem(
            "blockchain"
          )
        );


      if (
        !blockchain ||
        blockchain.length === 0
      ) {

        return;

      }


      const latestBlock =
        blockchain[
          blockchain.length - 1
        ];


      /*
        VOTE PAGE HASH
      */

      const hash =
        document.getElementById(
          "blockchain-hash"
        );


      if (hash) {

        hash.textContent =
          latestBlock.hash;

      }


      /*
        ADMIN HASH
      */

      const adminHash =
        document.getElementById(
          "admin-blockchain-hash"
        );


      if (adminHash) {

        adminHash.textContent =
          latestBlock.hash;

      }


      /*
        LENGTH
      */

      const length =
        document.getElementById(
          "blockchain-length"
        );


      if (length) {

        length.textContent =
          blockchain.length +
          " blocks";

      }


      /*
        TABLE
      */

      const table =
        document.getElementById(
          "blockchain-table"
        );


      if (!table) {

        return;

      }


      table.innerHTML = "";


      blockchain.forEach(
        function (block) {

          const voteId =
            typeof block.data ===
            "object"
              ? block.data.id
              : "N/A";


          table.innerHTML += `

            <tr>

              <td>
                ${block.index}
              </td>

              <td>
                ${new Date(
                  block.timestamp
                ).toLocaleString()}
              </td>

              <td>
                ${voteId}
              </td>

              <td>

                <small>

                  ${block.previousHash.substring(
                    0,
                    20
                  )}...

                </small>

              </td>

              <td>

                <small>

                  ${block.hash.substring(
                    0,
                    20
                  )}...

                </small>

              </td>

            </tr>

          `;

        }
      );

    }


    /* =====================================
       ESCAPE HTML
    ===================================== */
