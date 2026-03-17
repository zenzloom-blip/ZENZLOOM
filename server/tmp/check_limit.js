import upload from '../middlewares/uploadMiddleware.js';
console.log("---- MULTER LIMIT VERIFICATION ----");
console.log("Limits Object:", JSON.stringify(upload.limits, null, 2));
console.log("-----------------------------------");
process.exit(0);
