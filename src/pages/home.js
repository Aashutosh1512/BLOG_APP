import React from "react";
import Map from './map'
import styles from '../css/home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import { Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { faDirections,faSearch } from "@fortawesome/free-solid-svg-icons";
const CardImages = require.context("../../Server/upload/");

const getAllcardDetails=(response,reject)=>{
const promise = new Promise((resolve, reject) => {
  fetch("/getBlogCards")
    .then((response) => {
      if (!response.ok) throw Error("Unable to fetch All Roles");
      return response.json();
    })
    .then((getAllDetailEvents) => {
      resolve(getAllDetailEvents);
    })
    .catch((error) => {
      reject(error);
    });
});
return promise;
}

const addcards = (data) => {
  const promise = new Promise((resolve, reject) => {
    const datastring = `title=${encodeURIComponent(
      data.title
    )}&image=${encodeURIComponent(data.image)}&body=${encodeURIComponent(
      data.body
    )}`;
    fetch("/uploadCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: datastring,
    })
      .then((response) => {
        if (!response.ok) throw Error("Unable to Add  Data");
        return response.json();
      })
      .then((success) => {
        resolve(success);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

const Home =()=>{
  const [cardDetails,setCardDetail]=React.useState([]);
 
  React.useEffect(()=>{
getAllcardDetails().then(
  (details) => {
    setCardDetail(details);
  },
  (error) => {
    alert(error);
  }
);
  },[])
  const getCardagain=()=>{
    getAllcardDetails().then(
  (details) => {
    setCardDetail(details);
  },
  (error) => {
    alert(error);
  })
  }
 const sendData=(data)=>{
  addcards(data).then((s)=>{console.log(s)},(error)=>{alert(error)});
 }
   const result =useSelector((state)=>state.cartData)
console.warn("result",result);
var access=false;
if(result.length>0){
var len=result.length; 
access=result[len-1].access;  
}

    
  return (
    <div className={styles.mainDiv}>
      <Container>
        <Row>
          <Col className={styles.leftDiv}>

            </Col>
          <Col xs={6} className={styles.midDiv}>
            <BlogCards cardDetails={cardDetails} />{" "}
          </Col>
          <Col className={styles.rightDiv}>
            <Paper style={{ padding: "10px",marginBottom:"10px" }}>
              <Map />
            </Paper>
          { access && <Paper style={{ padding: "10px" }}>
              <CardForm sendData={sendData} getCardagain={getCardagain} />
            </Paper>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};
const BlogCards = ({ cardDetails }) => {
  return (
    <div >
      {cardDetails.map((detail) => {
        return (
          <div key={detail.id}>
            <Card style={{ width: "fit-content" }} className={styles.blogCards}>
              <Card.Body>
                <Card.Title className={styles.cardTitle}>
                  {detail.title}
                </Card.Title>
              </Card.Body>
              <Card.Img
                variant="top"
                src={CardImages(`./${detail.image}.jpg`)}
                style={{width: "30rem",
    height: "25rem"}}
    className={styles.cardImages}
              />
              <Card.Body>
                <Card.Text>{detail.body}</Card.Text>
                {/* <Button variant="primary">{detail.bottom}</Button> */}
              </Card.Body>
            </Card>
          </div>
        );
      })}


      
    </div>
  );
};
const CardForm = ({ sendData, getCardagain }) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [image, setImage] = React.useState([]);
  const submitForm = () => {
    const detail = {
      title: title,
      body: body,
      image: image,
    };
    sendData(detail);
    getCardagain();
    setTitle("");
    setBody("");
  };

  const upload = (ev) => {
    image = ev.currentTarget.value;
  };
  return (
    <div>
      <h4 style={{textAlign:"center"}}>Form Registration</h4>
      <form action="upload" method="post" enctype="multipart/form-data">
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Recipient's username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type="file"
            id="image"
            name="image"
            accept=".jpg"
            onChange={upload}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            type="submit"
            value="Upload"
          >
            upload
          </Button>
        </InputGroup>
        {/* <input />
        <input /> */}
      </form>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            style={{ boxShadow: "none", boxShadow: "2px 3px 1px grey" }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <FloatingLabel controlId="floatingTextarea2" label="Body">
            <Form.Control
              as="textarea"
              placeholder="Enter the Body"
              style={{
                height: "100px",
                boxShadow: "none",
                boxShadow: "2px 3px 1px grey",
              }}
              onChange={(e) => {
                setBody(e.target.value);
              }}
            />
          </FloatingLabel>
        </Form.Group>

        <Button variant="primary" type="button" onClick={submitForm}>
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default Home;
