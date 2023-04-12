import React  from "react"; 
import Nowrap from './Nowrap';
import PropTypes from 'prop-types';


/**
 * A component that provides a hidden file upload input field and triggers a callback with the selected file
 * or its content, depending on the `fileOnly` parameter.
 * @param {Object} props - The component's properties.
 * @param {React.ReactNode} props.children - The content to display as the upload button.
 * @param {function} props.onChange - The callback function to trigger when a file is selected.
 * @param {boolean} props.fileOnly - Whether to pass only the selected file to the callback (true) or its contents as a JSON object (false).
 */
function HiddenUpload({ children, onChange, fileOnly = false }) {
  const ref = React.useRef(null);

  /**
   * Handles the file selection event and triggers the `onChange` callback with the selected file or its contents.
   * @param {Object} event - The file selection event object.
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = JSON.parse(reader.result);
      onChange && onChange(data);
    };

    if (fileOnly) {
      return onChange && onChange(file);
    }

    reader.readAsText(file);
  };

  return (
    <div>
      {/* The clickable button that triggers the hidden file input */}
      <Nowrap small hover onClick={() => ref.current.click()}>
        {children}
      </Nowrap>
      {/* The hidden file input */}
      <input type="file" ref={ref} style={{ display: 'none' }} onChange={handleFileUpload} />
    </div>
  );
}

// Specifies the expected type and presence of the component's properties
HiddenUpload.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  fileOnly: PropTypes.bool,
};

export default HiddenUpload;