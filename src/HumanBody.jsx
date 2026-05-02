import React, { useState } from "react";
import { Modal, Button, Form, ModalHeader } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './Human.css';

const HumanBody = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedBackPart, setBackSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBackModal, setBackShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedLabel, setExpandedLabel] = useState(null);
  const [imageSrc, setImageSrc] = useState(true);
  const [expandedChecked, setExpandedChecked] = useState(null);

  const bodyParts = [
    {
      name: "Heart",
      info: [
        {
          label: "Heart",
          descriptions: ["The heart pumps blood through the body.", "Example of checkbox", "A healthy heart is crucial for overall well-being", "A healthy heart is crucial for overall well-being.", "Regular exercise, balanced nutrition, and stress management are key to maintaining heart health.", "The heart is a muscular organ that pumps blood throughout the body.", "This can increase the risk of stroke,", "heart failure, and other complications."],
          image: "/wallpaper/001.png",
        },
        {
          label: "Veins",
          descriptions: ["Veins carry blood back to the heart."],
          image: "/wallpaper/002.png",
        },
        {
          label: "pump",
          descriptions: ["The main pump is inserted into the tip of the heart.", "The heart is a muscular organ that pumps blood throughout the body.", "It has four chambers: two atria and two ventricles.", "A healthy heart is crucial for overall well-being."],
          image: "/wallpaper/004.png",
        },
      ],
      // img: "/images/heart.png",
      coords: { top: "26%", left: "46%" },
    },
    {
      name: "Head",
      info: [
        {
          label: "Brain",
          descriptions: [
            "The brain is the control center of the body.",
            "It regulates thoughts, emotions, and motor functions.",
            "The  processes sensory information and controls behavior.",
          ],
          image: "/wallpaper/Brain02.png",
        },
        {
          label: "Eyes",
          descriptions: [
            "The eyes are the organs of vision.",
            "They detect light and send signals to the brain.",
            "Eyes help in perceiving depth, color, and movement.",
          ],
          image: "/wallpaper/Brain03.png",
        },
        {
          label: "Nose",
          descriptions: [
            "The nose helps with breathing and smelling.",
            "It filters, warms, and humidifies the air we breathe.",
            "The nose houses the olfactory receptors for smell.",
          ],
          image: "/wallpaper/Brain02.png",
        },
      ],
      coords: { top: "3%", left: "48%" },
    },

    {
      name: "Leg",
      info: [
        {
          label: "Thigh",
          descriptions: ["The thigh is the upper part of the leg."],
          image: "/wallpaper/leg1.png",
        },
        {
          label: "Knee",
          descriptions: ["The knee is the joint between the thigh and lower leg."],
          image: "/wallpaper/leg2.png",
        },
      ],
      // img: "/images/leg.png",
      coords: { top: "80%", left: "41%" },
    },
  ];

   const bodyBackParts = [
    {
      name: "Back",
      info: [
        {
          label: "Spine",
          descriptions: [
            "The spine provides structural support to the body.",
            "It protects the spinal cord and supports movement.",
            "The spine consists of vertebrae, intervertebral discs, and ligaments."
          ],
          "image": "/wallpaper/Spine.png"
        },
        {
          label: "Shoulder Blades",
          descriptions: [
            "The shoulder blades connect the upper arms to the collarbone.",
            "They allow a wide range of motion in the arms.",
            "These bones provide attachment points for muscles of the back and shoulders."
          ],
          "image": "/wallpaper/ShoulderBlades.png"
        },
        {
          label: "Lower Back",
          descriptions: [
            "The lower back supports the weight of the upper body.",
            "It is involved in movements like bending and twisting.",
            "Muscles in the lower back play a key role in posture and stability."
          ],
          "image": "/wallpaper/Pasted image.png"
        }
      ],
      coords: { "top": "32%", "left": "47%" }
    },
  ];

  const handlePartClick = (part) => {
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleClose = () => { setShowModal(false); setBackShowModal(false) }

  const handleBackPartClick = (part) => {
    setBackSelectedPart(part)
    setBackShowModal(true)
  }

  const handleCheckboxChange = (partName, itemLabel) => {
    setFormData((prev) => {
      const partData = prev[partName] || [];
      const isSelected = partData.includes(itemLabel);

      return {
        ...prev,
        [partName]: isSelected
          ? partData.filter((item) => item !== itemLabel)
          : [...partData, itemLabel],
      };
    });
  };

  const isSubmitDisabled = Object.values(formData).every(
    (items) => items.length === 0
  );

  const isChecked = (partName, itemLabel) =>
    formData[partName]?.includes(itemLabel) || false;

  const handleSubmit = () => {
    console.log("Form Data Payload:", formData);
    toast.success("Form submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    // setShowModal(!showModal);
    // setFormData("")
    alert(JSON.stringify(formData, null, 2));
  };

  const handleImageClick = (image, label, description) => {
    setExpandedImage(image);
    setExpandedLabel(label);
    setExpandedChecked(description);
  };

  const handleExpandedClose = () => {
    setExpandedImage(null);
    setExpandedLabel(null);

  }

  const handleChangePic = () => {
    setImageSrc((prevState) => !prevState);
  }

  return (
    <div style={{ position: "relative", textAlign: "center" }} className="container" id="main-human-box">
      {/* <DiagnosedYourself/> */}
      {/* Human Body Image */}
      {imageSrc === true ? (
        <div style={{ position: "relative", transition: "all ease 0.2s" }}>
          <img
            src="/wallpaper/man 1.png"
            alt="Human Body"
            style={{ width: "auto", height: "auto" }}
          />
          {/* Clickable Body Parts */}
          {bodyParts.map((part, index) => (
            <div
              key={index}
              onClick={() => handlePartClick(part)}
              style={{
                position: "absolute",
                top: part.coords.top,
                left: part.coords.left,
                width: "20px",
                height: "20px",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              title={part.name}
            ></div>
          ))}
        </div>) :

        (<div style={{ position: "relative", transition: "all ease 0.2s", paddingRight: "30px" }}>
          <img
            src="/wallpaper/man 2.png"
            alt="Human Body"
            style={{ width: "auto", height: "auto" }}
          />

          {/* Clickable Body Parts */}
          {bodyBackParts.map((part, index) => (
            <div
              key={index}
              onClick={() => handleBackPartClick(part)}
              style={{
                position: "absolute",
                top: part.coords.top,
                left: part.coords.left,
                width: "20px",
                height: "20px",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              title={part.name}
            ></div>
          ))}
        </div>)}
      <Button className="body-btn" onClick={handleChangePic}> <FontAwesomeIcon icon={faArrowsRotate} /> {imageSrc ? "Front Body" : "Back Body"} </Button>
      {/* Modal for Popup Front Body */}
      <Modal show={showModal} onHide={handleClose} className="main-warper" style={{ display: "flex !important", justifyContent: "center", alignContent: "center" }}>
        <div className="container main-box">
          <div className="row">
            <Modal.Header closeButton>
              <Modal.Title>{selectedPart?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col-md-12 py-2">
                <p className="m-0 fw-bold">Details about Front {selectedPart?.name}:</p>
              </div>
              <div className="row row-manage  border-top my-2 align-items-center" >
                {selectedPart?.info.map((item, index) => (
                  <div className="col-md-4 cursor-pointer">
                    <img
                      onClick={() => handleImageClick(item?.image, item?.label, item?.description)}
                      src={item?.image}
                      alt={selectedPart?.name}
                      style={{ width: "100%" }}
                      className="p-2"
                    />
                  </div>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleClose}>
                Close
              </Button> */}
              {/* img expanded popup */}
              <Modal show={!!expandedImage} onHide={handleExpandedClose} size="lg" centered>
                <Modal.Body className="text-center inner-box-manager">
                  <ModalHeader closeButton>
                    <h2 className="border-bottom pt-2 pb-3 m-0">{expandedLabel}</h2>
                  </ModalHeader>
                  <img
                    src={expandedImage}
                    alt="Expanded View"
                    className="heart-block"
                  />
                  <div className="organ-details-box custom-scrollbar row">
                    {selectedPart?.info
                      .filter((item) => item.label === expandedLabel)
                      .map((item) =>
                        item?.descriptions?.map((desc, index) => (
                          <div className="col-auto" key={index}>
                            <Form className="py-2">
                              <Form.Group controlId={`checkbox-${desc}`}>
                                <Form.Check
                                  type="checkbox"
                                  label={`${desc}`}
                                  checked={isChecked(selectedPart?.name, desc)}
                                  onChange={() => handleCheckboxChange(selectedPart?.name, desc)}
                                />
                              </Form.Group>
                            </Form>
                          </div>
                        ))
                      )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitDisabled}>
                      Submit
                    </Button>
                    <ToastContainer />
                  </div>
                  {/* <Button variant="secondary" onClick={handleExpandedClose}>
                    Close
                  </Button> */}
                </Modal.Footer>
              </Modal>
            </Modal.Footer>
          </div>
        </div>
      </Modal >
      {/* Show popup Back body */}
      <Modal show={showBackModal} onHide={handleClose} style={{ display: "flex !important", justifyContent: "center", alignContent: "center" }}>
        <div className="container main-box">
          <div className="row">
            <Modal.Header closeButton>
              <Modal.Title>{selectedBackPart?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col-md-12 py-2">
                <p className="m-0 fw-bold">Details about {selectedBackPart?.name}:</p>
              </div>
              <div className="row border-top my-2 align-items-center" >
                {selectedBackPart?.info.map((item, index) => (
                  <div className="col-md-4 cursor-pointer">
                    <img
                      onClick={() => handleImageClick(item?.image, item?.label, item?.descriptions)}
                      src={item?.image}
                      alt={selectedBackPart?.name}
                      style={{ width: "100%" }}
                      className="p-2"
                    />
                  </div>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleClose}>
                Close
              </Button> */}
              {/* img expanded popup */}
              <Modal show={!!expandedImage} onHide={handleExpandedClose} size="lg" centered>
                <Modal.Body className="text-center inner-box-manager">
                  <ModalHeader closeButton>
                    <h2 className="border-bottom pt-2 pb-3 m-0">{expandedLabel}</h2>
                  </ModalHeader>
                  <img
                    src={expandedImage}
                    alt="Expanded View"
                    className="heart-block"
                  />
                  <div className="organ-details-box  custom-scrollbar row">
                    {selectedBackPart?.info
                      .filter((item) => item.label === expandedLabel)
                      .map((item) =>
                        item?.descriptions?.map((desc, index) => (
                          <div className="col-auto" key={index}>
                            <Form className="py-2">
                              <Form.Group controlId={`checkbox-${desc}`}>
                                <Form.Check
                                  type="checkbox"
                                  label={`${desc}`}
                                  checked={isChecked(selectedBackPart?.name, desc)}
                                  onChange={() => handleCheckboxChange(selectedBackPart?.name, desc)}
                                />
                              </Form.Group>
                            </Form>
                          </div>
                        ))
                      )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitDisabled} >
                      Submit
                    </Button>
                    <ToastContainer />
                  </div>
                  {/* <Button variant="secondary" onClick={handleExpandedClose}>
                    Close
                  </Button> */}
                </Modal.Footer>
              </Modal>
            </Modal.Footer>
          </div>
        </div>
      </Modal >
    </div >
  );
};

export default HumanBody;













