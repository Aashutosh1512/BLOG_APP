import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux/es/exports";
import { addToCard } from "../redux/action";
import { useSelector } from "react-redux";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const addMember = (member) => {
 
  const promise = new Promise((resolve, reject) => {
    var datastring = `username=${encodeURIComponent(
      member.userName
    )} &password=${encodeURIComponent(member.password)}`;
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: datastring,
    })
      .then((response) => {

        if (!response.ok) throw Error("unable to connect database");
        return response.json();
      })
      .then((member) => {
        resolve(member);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
  return promise;
};
const login = (member) => {

  const promise = new Promise((resolve, reject) => {
    var datastring = `username=${encodeURIComponent(
      member.userName
    )} &password=${encodeURIComponent(member.password)}`;
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: datastring,
    })
      .then((response) => {
        if (!response.ok) throw Error("unable to connect database");
        return response.json();
      })
      .then((member) => {
        resolve(member);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
  return promise;
};

const Register=()=>{
   const result =useSelector((state)=>state.cartData)
console.warn("result",result);
var access=false;
if(result.length>0){
var len=result.length; 
access=result[len-1].access;  
}

  return (
    <div>
      <Container>
        <Row>
         {access && <Col style={{alignItem:"center"}}>{<Form/>}</Col>}
          <Col >{<Login/>}</Col>
        </Row>
      </Container>
    </div>
  );
}
const Form = ({ handleClose }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    var member = {
      userName: userName,
      password: password,
    };
    addMember(member).then(
      (resolve) => {
        console.log("ok");
      },
      (reject) => {
        console.log("error");
      }
    );
    handleClose();
    navigate("/");
  };

  return (
    <div>
      <h1 style={{    "width":"fit-content",
    margin: "auto"}}>Register</h1>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          label="username"
          variant="filled"
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Signup
          </Button>
        </div>
      </form>
    </div>
  );
};



const Login = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message,setMessage]=React.useState("");
 
 const dispatch = useDispatch();
  const data = {
    access:true
  };  
  const handleSubmit = (e) => {
    e.preventDefault();
    var member = {
      userName: userName,
      password: password,
    };
    login(member).then(
      (resolve) => {
        console.warn(resolve.success);
        if(resolve.success===true){
          console.log(resolve.resultSet[0].PASSWORD);
          // setAccessId(resolve.resultSet[0].PASSWORD);
             dispatch(addToCard(data));
          navigate("/")
        }
        else{
          setMessage(resolve.message)
        }
      },
      (reject) => {
        console.log("error");
      }
    );

  };

    
  return (
    <div>
      <h1 style={{ width: "fit-content", margin: "auto"}}>Login</h1>

      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          label="username"
          variant="filled"
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span style={{ color: "red" }}>{message}</span>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
