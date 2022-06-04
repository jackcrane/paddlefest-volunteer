import Input from "./Input";
import { useState } from "react";

const Signup = (props) => {
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const validatePhone = (phone) => {
    var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return re.test(phone);
  };

  const [values, setValues] = useState({});

  const handleInput = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    props.setValues(newValues);
  };

  return (
    <div>
      <h1>Your basic information</h1>
      <p>
        We collect this information for our internal use only. It will not be
        shared or sold. This is the information we will use to contact you
        leading up to and during the event, so please provide accurate
        information.
      </p>
      <Input
        placeholder="Your name"
        name="name"
        onInput={(text) => {
          handleInput("name", text);
          if (text.length < 2) {
            return {
              valid: false,
              error: "Please enter your full name",
            };
          } else {
            return {
              valid: true,
              error: "",
            };
          }
        }}
      />
      <Input
        placeholder="Your Email"
        name="email"
        type="email"
        onInput={(text) => {
          handleInput("email", text);
          if (text.length < 2) {
            return {
              valid: false,
              error: "Please enter your full email",
            };
          } else if (!validateEmail(text)) {
            return {
              valid: false,
              error: "This doesn't look like an email!",
            };
          } else {
            return {
              valid: true,
              error: "",
            };
          }
        }}
      />
      <Input
        placeholder="Your Phone Number (xxx-xxx-xxxx)"
        name="tel"
        type="tel"
        onInput={(text) => {
          handleInput("phonenum", text);
          if (text.length < 10) {
            return {
              valid: false,
              error: "Please enter your full phone number",
            };
          } else if (!validatePhone(text)) {
            return {
              valid: false,
              error: "This doesn't look like a phone number!",
            };
          } else {
            return {
              valid: true,
              error: "",
            };
          }
        }}
      />
      <Input
        placeholder="Your Age"
        name="age"
        onInput={(text) => {
          handleInput("age", parseInt(text));
          if (isNaN(text)) {
            return {
              valid: false,
              error: "Age must be a number",
            };
          } else if (text.length < 1) {
            return {
              valid: false,
              error: "Please enter your age",
            };
          } else if (parseInt(text) < 13) {
            return {
              valid: false,
              error: "You must be over 13 to volunteer",
            };
          } else {
            return {
              valid: true,
              error: "",
            };
          }
        }}
      />
      <Input
        placeholder="Shirt size"
        onInput={(text) => {
          handleInput("shirt_size", text);
          if (text.length < 1) {
            return {
              valid: false,
              error: "Please enter a shirt size",
            };
          } else if (
            !["XS", "S", "M", "L", "XL", "XXL"].includes(text.toUpperCase())
          ) {
            return {
              valid: false,
              error: "Shirt size invalid",
            };
          } else {
            return {
              valid: true,
              error: "",
            };
          }
        }}
        dataList={["XS", "S", "M", "L", "XL", "XXL"]}
        helperText="Shirt sizes are: 'XS', 'S', 'M', 'L', 'XL', 'XXL'"
      />
    </div>
  );
};

export default Signup;