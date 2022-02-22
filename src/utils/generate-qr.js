const { createCanvas, loadImage } = require("canvas");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const encrypt = require("./encrypt");

const create = async ({ dataForQRcode, center_image, width, cwidth }) => {
  try {
    const canvas = createCanvas(width, cwidth);
    await QRCode.toCanvas(canvas, dataForQRcode, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const ctx = canvas.getContext("2d");
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    ctx.drawImage(img, center, center, cwidth, cwidth);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.log("qrcodeerror", error);
  }
};

const generateQrs = () => {
  return async function decrypt(obj) {
    try {
      // this function is for QR generate during add on people use case
      // I just found the code in the internet. :)

      // const id = obj;
      const id = obj.id;
      const str = JSON.stringify(obj)
      // const str = obj;
      const centerImageBase64 = await fs.readFileSync(
        path.resolve(`static/R2.png`)
      );

      const qrCode = await create({
        dataForQRcode: str,
        center_image: centerImageBase64,
        width: 120,
        cwidth: 50,
      });
      console.log("qrCode", qrCode);

      // replace ?
      const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");

      // write the image file
      await fs.writeFile(
        path.resolve(`images/${id}.png`),
        base64Data,
        "base64",
        function (err) {
          if (err) console.log(err);
        }
      );

      return true;
    } catch (e) {
      console.log("Error on generate QR: ", e);
      return false;
    }
  };
};

module.exports = generateQrs;
