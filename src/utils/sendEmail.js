import emailjs from "@emailjs/browser";
const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const sendEmail = (user, body) => {
   if (!(templateId && emailjsPublicKey)) return;
   emailjs
      .send(
         "default_service",
         templateId,
         {
            message: body,
            recipient: `${user}@messiah.edu`,
            reply_to: "bhuang@messiah.edu",
         },
         emailjsPublicKey,
      )
      .then(
         function (response) {},
         function (error) {
            console.log("FAILED...", error);
         },
      );
};

export default sendEmail;
