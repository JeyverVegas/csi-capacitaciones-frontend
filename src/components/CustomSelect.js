import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const CustomSelect = ({ styles, options, selectedValue, handleInputChange, inputValue, isLoading, onSelectValue, optionLabel, isEmptyMessage, inputPlaceholder, onReachEnd }) => {

    const { background } = useTheme();

    const [showOptions, setShowOptions] = useState(false);

    const inputRef = useRef();

    const inputOptionContainer = useRef();

    const [dots, setDots] = useState("");



    useEffect(() => {
        console.log(background);
    }, [background])

    useEffect(() => {
        document.addEventListener('click', (e) => {
            setShowOptions(handleClickOut(e));
        });
    }, [inputRef, inputOptionContainer])

    const handleClickOut = (e) => {
        if (inputRef?.current !== e?.target && e.target !== inputOptionContainer?.current) {
            return false;
        }

        return true;
    }

    useEffect(() => {
        let id;

        if (isLoading) {
            id = setInterval(() => {
                setDots((oldDots) => oldDots.length < 3 ? oldDots + "." : "");
            }, 500);
        }

        return () => {
            if (id) clearInterval(id);
        }
    }, [isLoading]);

    return (
        <div className="position-relative">
            <input
                onFocus={() => { setShowOptions(true) }}
                className="form-control"
                placeholder={inputPlaceholder ? inputPlaceholder : "Buscar"}
                onChange={handleInputChange}
                value={inputValue}
                ref={inputRef}
            />
            {
                showOptions &&
                <div className={`border shadow p-2 mt-1 position-absolute w-100 custom-scrollbar ${background?.value === 'dark' ? 'custom-bg-dark scrollbar-light' : 'custom-bg-light scrollbar-dark'}`} style={{ top: '40px', left: 0, maxHeight: 150, zIndex: 1, overflowY: 'auto' }} ref={inputOptionContainer}>
                    {
                        isLoading ?
                            <div className="text-center">Cargando{dots}</div>
                            :
                            options?.length > 0 ?
                                options?.map?.((option, i) => {
                                    return (
                                        <div className={`my-1 custom-select-option ${background?.value === 'dark' ? 'custom-select-option-light' : 'custom-select-option-dark'}`} style={{ cursor: 'pointer' }} onClick={() => { onSelectValue(option) }} key={i}>
                                            {option?.[optionLabel]}
                                        </div>
                                    )
                                })
                                :
                                <div className="text-center">
                                    {isEmptyMessage ?
                                        isEmptyMessage
                                        :
                                        'No hay resultados'
                                    }
                                </div>
                    }
                </div>
            }
        </div>
    )
}

export default CustomSelect;