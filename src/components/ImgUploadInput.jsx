import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";


const ImgUploadInput = ({ multiple, value, style, accept, icon, button, className, description, change, name, previewImage, deleteButton, imageStyle }) => {

  const [files, setFiles] = useState([]);

  const [preview, setPreview] = useState(null)

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview(null);
    }
  }, [value])

  useEffect(() => {
    setPreview(previewImage)
  }, [previewImage])

  useEffect(() => {
    if (files.length > 0) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(files[0]));
      change?.({ target: { name: name, files: files, type: "file" } });
    }
  }, [files])

  const handleDelete = (e) => {
    setFiles([]);
    setPreview(null);
    change?.({ target: { name: name, files: null, type: "file" } });
  }

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept ? accept : 'image/*',
    maxFiles: 1,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles
      )
    },
    onDragEnter: (event) => {
      setActive(true);
    },
    onDragLeave: (event) => {
      setActive(false);
    },
    onDropAccepted: () => {
      setActive(false);
    }
  });

  return (
    <div style={{ height: "200px", position: 'relative', margin: 'auto', width: '100%', ...style }} className={`rounded ${className}`} >
      {deleteButton ?
        <button className="btn btn-danger" type="button" onClick={handleDelete}
          style={{ height: 20, width: 20, position: 'absolute', borderRadius: '100%', padding: 0, top: -7, right: -7, zIndex: 10 }}
        >
          X
        </button>
        :
        null
      }
      <div
        {...getRootProps()}
        className={"cursor-pointer h-100"}
      >
        <div className={clsx(["transition duration-300 d-flex h-100 position-relative"], {
          "border border-dashed border-main rounded shadow-2xl": active,
          "border border-dashed border-gray-200 rounded": !active,
        })}>
          {
            preview ?
              <img style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, ...imageStyle }} src={preview} alt="preview-image" />
              :
              <div className="text-center m-auto px-6">
                <div className={clsx({
                  "text-main": active,
                  "text-gray-200": !active
                })}>
                  {icon}
                </div>
                <div className={clsx(["font-bold text-xl"], {
                  "text-main": active,
                  "text-gray-200": !active
                })}>
                  <label>{description ? description : "Arrastre una imagen o haga click"}</label>
                </div>
              </div>
          }
        </div>
        {
          button ?
            <div className="text-center mt-2">
              <button className="bg-main p-4 rounded text-white">
                {button.text}
              </button>
            </div>
            :
            null
        }
        <input type="file" {...getInputProps()} />
      </div>
    </div >

  )
}

ImgUploadInput.propTypes = {
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  change: PropTypes.func,
  button: PropTypes.object,
  previewImage: PropTypes.string
}

export default ImgUploadInput;
