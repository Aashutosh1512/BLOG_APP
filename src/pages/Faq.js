import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import styles from "../css/home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDirections,faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
  const getAllFAQ = () => {
    const promise = new Promise((resolve, reject) => {
      fetch("/getFAQ")
        .then((response) => {
          if (!response.ok) throw Error("Unable to fetch All FAQ");
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
  };

    const addForm = (data) => {
       alert(JSON.stringify(data));
      const promise = new Promise((resolve, reject) => {
const datastring = `question=${encodeURIComponent(
  data.question
)}&answer=${encodeURIComponent(data.answer)}`;
        fetch("/addingFaq", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: datastring,
        })
          .then((response) => {
            if (!response.ok) throw Error("Unable to Add  FAQ");
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
  const About=()=>{
    const [error,setError]=React.useState("");
     const [FAQS, setFAQS] = React.useState([]);
     const [searchWhat,setSearchWhat]=React.useState("NONE")
 const result =useSelector((state)=>state.cartData)
console.warn("result",result);
var access=false;
if(result.length>0){
var len=result.length; 
access=result[len-1].access;  
}

    const [mapLoc, setMapLoc] = React.useState(
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.3241864799247!2d75.86969521496219!3d22.716188785109054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd16df120227%3A0xd5b5a0bb71543c2b!2sDevi%20Ahilya%20Vishwavidyalaya!5e0!3m2!1sen!2sin!4v1659375756495!5m2!1sen!2sin"
    );
     

      React.useEffect(() => {
        getAllFAQ().then(
          (details) => {
            setFAQS(details);
          },
          (error) => {
            alert(error);
          }
        );
      }, []);
    const dataSend =(data)=> {
      addForm(data).then(
        (success) => {
          setError("Successfully added");
        },
        (error) => {
          setError("Unable to Add data");
        }
      );
    };
    const getMapLoc=(loc)=>{
     setMapLoc(loc);
    }
const filtered=(ev)=>{
  if(ev.currentTarget.value.length===0){
    setSearchWhat("NONE");
  }

  setSearchWhat(ev.currentTarget.value);
}

const fliterFaq=FAQS.filter((faq)=>{
  if (searchWhat === "NONE") {
    return true;
  }
return faq.question.toLowerCase().includes(searchWhat.toLowerCase());
})

    return (
      <div>
        <input
          className={styles.searchBox}
          type="text"
          placeholder={`Search By Questions`}
          onChange={filtered}
        />
       

        <Container>
          <Row>
            <Col className={styles.FaqSection}>
              <FAQ getMapLoc={getMapLoc} FAQS={fliterFaq} />
            </Col>
            <Col
              className={styles.Addingsection}
              style={{ textAlign: "center", margin: "auto" }}
            >
              <MapInd mapLoc={mapLoc} />
            </Col>
          </Row>
         { access && <Row>
            <FormAdding dataSend={dataSend} error={error} />
          </Row>}
        </Container>
      </div>
    );
  }

const FAQ = ({ getMapLoc, FAQS }) => {
  const gotoMap = (ev) => {
    getMapLoc(ev.currentTarget.value);
    // alert(ev.currentTarget.value);
  };
  return (
    <div>
      {
        <Accordion defaultActiveKey={1} alwaysOpen flush>
          {FAQS.map((faq) => {
            return (
              <div key={faq.id}>
                <Accordion.Item eventKey={faq.id}>
                  <Accordion.Header>{faq.question}</Accordion.Header>
                  <Accordion.Body>
                    {faq.answer}
                    <br></br>
                    {
                     (faq.direction!=="") && <button
                      className={styles.DirectionButton}
                      id={faq.id}
                      value={faq.direction}
                      onClick={gotoMap}
                    >
                   
                      Go to <FontAwesomeIcon icon={faDirections} />
                    </button>}
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            );
          })}
        </Accordion>
      }
    </div>
  );
};
const FormAdding = ({ dataSend,error }) => {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const submitForm = () => {
    const detail={
      question:question,
      answer:answer
    };
    dataSend(detail);
  };
  return (
    <div>
    <h3 style={{color:"green"}}>{error}</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Question"
            style={{ boxShadow: "none", boxShadow: "2px 3px 1px grey" }}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <FloatingLabel controlId="floatingTextarea2" label="Answer">
            <Form.Control
              as="textarea"
              placeholder="Please Type your Answer"
              style={{
                height: "100px",
                boxShadow: "none",
                boxShadow: "2px 3px 1px grey",
              }}
              onChange={(e) => {
                setAnswer(e.target.value);
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
const MapInd = ({ mapLoc }) => {
  return (
    <div>
      <iframe
        src={`${mapLoc}`}
        width="400"
        height="400"
        style={{ border: "0" }}
        allowfullscreen="true"
        loading="lazy"
      ></iframe>
    </div>
  );
};
export default About;
