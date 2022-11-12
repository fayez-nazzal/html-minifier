import { customAlphabet } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

var { minify } = require("html-minifier-terser");

const minifyHTML = async (req: NextApiRequest, res: NextApiResponse) => {
  const { html } = req.body;

  const minifiedHTML = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  res.status(200).json({ minifiedHTML });
};

export default minifyHTML;
