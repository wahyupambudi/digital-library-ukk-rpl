const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function Insert(req, res) {
  const { kategori_buku_id, kategoriid, bukuid } = req.body;

  const payload = {
    kategori_buku_id,
    kategoriid,
    bukuid,
  };

  if (!kategori_buku_id || !kategoriid || !bukuid) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  try {
    const checkRelationCategory = await prisma.Kategori_buku_relasi.findUnique({
      where: {
        kategori_buku_id,
      },
    });

    if (checkRelationCategory) {
      let resp = ResponseTemplate(
        null,
        "Id Kategori Relation already used",
        null,
        400,
      );
      res.status(400).json(resp);
      return;
    }

    const categories = await prisma.Kategori_buku_relasi.create({
      data: payload,
    });

    let resp = ResponseTemplate(categories, "success", null, 200);
    res.json(resp);
  } catch (error) {
    console.log(error);
    let resp = ResponseTemplate(null, "internal server error", null, 500);
    res.status(500).json(resp);
    return;
  }
}

module.exports = { Insert };