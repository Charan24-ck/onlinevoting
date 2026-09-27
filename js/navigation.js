// Sidebar and page navigation

function loadCurrentView() {

      const hash =
        window.location.hash
          .substring(1) ||
        "dashboard";


      showView(
        hash
      );

    }

function showView(
      viewId
    ) {


      /*
        ADMIN PROTECTION
      */

      if (
        viewId === "admin" &&
        !isAdmin()
      ) {

        showLoginModal();

        return;

      }


      /*
        HIDE CONTENT
      */

      document
        .querySelectorAll(
          ".main-content > .tab-content"
        )
        .forEach(
          function (element) {

            element.classList.remove(
              "active"
            );

          }
        );


      /*
        REMOVE ACTIVE SIDEBAR
      */

      document
        .querySelectorAll(
          ".sidebar-menu a"
        )
        .forEach(
          function (link) {

            link.classList.remove(
              "active"
            );

          }
        );


      const content =
        document.getElementById(
          viewId +
          "-content"
        );


      if (!content) {

        return;

      }


      content.classList.add(
        "active"
      );


      const link =
        document.getElementById(
          viewId +
          "-tab"
        );


      if (link) {

        link.classList.add(
          "active"
        );

      }


      document.getElementById(
        "page-title"
      ).textContent =
        viewId
          .charAt(0)
          .toUpperCase() +
        viewId.slice(1);


      window.location.hash =
        viewId;


      if (
        viewId === "admin"
      ) {

        loadAdminData();

      }


      if (
        viewId === "blockchain"
      ) {

        updateBlockchainUI();

      }

    }


    /* =====================================
       EVENT LISTENERS
    ===================================== */
