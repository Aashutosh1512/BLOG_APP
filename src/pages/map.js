import React from 'react';

function Map() {
  return (
    <div className="App">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58896.75750952666!2d75.80037805820312!3d22.68928140000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcef50d20ba3%3A0x592abbfe7172123e!2sDevi%20Ahilya%20Vishwavidyalaya%20Takshila%20Campus!5e0!3m2!1sen!2sin!4v1658684942268!5m2!1sen!"
        width="300"
        height="300"
        style={{ border: "0" }}
        allowfullscreen="true"
        loading="lazy"
      ></iframe>
    </div>
  );

}

export default Map;
