import { Router } from "express";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the country
 *         countryCode:
 *           type: string
 *           description: The country code
 *       example:
 *         countryCode: UA
 *         name: Ukraine
 *     CountryDetails:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the country
 *         countryCode:
 *           type: string
 *           description: The country code
 *       example:
 *         countryCode: UA
 *         name: Ukraine
 */

/**
 * @swagger
 * /countries/available-countries:
 *   get:
 *     summary: Returns a list of countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */
router.get("/available-countries", async (req, res) => {
  try {
    const response = await fetch(
      "https://date.nager.at/api/v3/AvailableCountries"
    );

    if (!response.ok) {
      throw new Error("Error: Failed to fetch at Data Nager API");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    throw new Error("Error: Failed to fetch at Data Nager API");
  }
});

/**
 * @swagger
 * /countries/details:
 *   post:
 *     summary: Returns details of a country
 *     tags:
 *       - Countries
 *     requestBody:
 *       description: Details of a country
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CountryDetails'
 *         application/xml:
 *           schema:
 *             $ref: '#/components/schemas/CountryDetails'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/CountryDetails'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 borders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       commonName:
 *                         type: string
 *                         description: Belarus
 *                       officialName:
 *                         type: string
 *                         description: Republic of Belarus
 *                       countryCode:
 *                         type: string
 *                         description: BY
 *                       region:
 *                         type: string
 *                         description: Europe
 *                       borders:
 *                         type: string
 *                         description: none
 *                 population:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: number
 *                         description: 2024
 *                       value:
 *                         type: number
 *                         description: 100000
 *                 flag:
 *                   type: string
 *                   example: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg"
 */

router.post("/details", async (req, res) => {
  const { countryCode, country } = req.body;

  const urls = [
    `https://date.nager.at/api/v3/CountryInfo/${countryCode}`,
    "https://countriesnow.space/api/v0.1/countries/population",
    "https://countriesnow.space/api/v0.1/countries/flag/images",
  ];

  const fetchPromises = [
    fetch(urls[0]).then((res) => res.json()),
    fetch(urls[1], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    }).then((res) => res.json()),
    fetch(urls[2], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ iso2: countryCode }),
    }).then((res) => res.json()),
  ];

  const results = await Promise.all(fetchPromises);

  const formattedResults = {
    borders: results[0].borders ?? null,
    populationCounts:
      results[1] && results[1].data ? results[1].data.populationCounts : null,
    flag: results[2] && results[2].data ? results[2].data.flag : null,
  };

  res.send(formattedResults);
});

export default router;
