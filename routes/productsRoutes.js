const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log(erreur);
      res.status(500).render("erreur", { erreur });
    } else {
      connection.query("SELECT * FROM products", [], (erreur, resultat) => {
        if (erreur) {
          console.log(erreur);
          res.status(500).render("erreur", { erreur });
        } else {
          res.status(200).render("index", { resultat });
        }
      });
    }
  });
});

router.post("/products", (req, res) => {
  let id = req.body.id === "" ? null : req.body.id;
  let title = req.body.title;
  let description = req.body.description;

  let reqSql =
    id === null
      ? "INSERT INTO products(id, title, description) VALUES(?, ?, ?)"
      : "UPDATE products SET title = ?, description = ? WHERE id = ?";

  let donnees =
    id === null ? [null, t, description] : [title, description, id];

  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log(erreur);
      res.status(500).render("erreur", { erreur });
    } else {
      connection.query(reqSql, donnees, (erreur, resultat) => {
        if (erreur) {
          console.log(erreur);
          res.status(500).render("erreur", { erreur });
        } else {
          res.status(300).redirect("/");
        }
      });
    }
  });
});

router.delete("/products/:id", (req, res) => {
  let id = req.params.id;
  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log(erreur);
      res.status(500).render("erreur", { erreur });
    } else {
      connection.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (erreur, resultat) => {
          if (erreur) {
            console.log(erreur);
            res.status(500).render("erreur", { erreur });
          } else {
            res.status(200).json({ routeRacine: "/" });
          }
        }
      );
    }
  });
});

module.exports = router;
