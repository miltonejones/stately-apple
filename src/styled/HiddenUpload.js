import React  from "react"; 
import Nowrap from './Nowrap';


function HiddenUpload({ children, onChange }) {
  const ref = React.useRef(null); 

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = JSON.parse(reader.result);
      onChange && onChange(data);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <Nowrap small hover onClick={() => ref.current.click()}>{children}</Nowrap>
      <input type="file" ref={ref} style={{ display: 'none' }} onChange={handleFileUpload} /> 
    </div>
  );
}
 


export default HiddenUpload;
