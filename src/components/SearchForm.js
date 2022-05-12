import { useState } from 'react'
import {FaAngleDoubleLeft, FaAngleDoubleRight, FaTrash} from "react-icons/fa";
import UploadContainer from "./UploadContainer";

const SearchForm = (props) => {

    const [text, setText] = useState('')
    const [showSearchForm, setSearchForm] = useState(true)

    const onSubmit = (e) => {
        e.preventDefault()
/*
        if (!text) {
            alert('empty search')
            return
        }*/

        props.search(text)
    }
    return (
        <div className={`SearchForm-Container ${showSearchForm && 'Open'}`}>

            <div className='SearchForm-Header'>
                {
                    showSearchForm ? <label>Search</label> : <></>
                }
                {
                    showSearchForm ? <FaAngleDoubleLeft
                            className='AngleIconButton'
                            onClick={() => setSearchForm(!showSearchForm)}/> :
                        <FaAngleDoubleRight
                            className='AngleIconButton'
                            onClick={() => setSearchForm(!showSearchForm)}/>
                }
            </div>
            <div>
                {
                    showSearchForm ?
                        <form className='SearchForm' onSubmit={onSubmit}>
                            <input
                                className='TextInput'
                                type='text'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder='search'/>


                            <UploadContainer setFile={props.setFile} file={props.file}/>

                            {
                                props.file ?
                                    <div className='FileInfo-Container'>
                                        <div className='FileInfo'>
                                            <div className='FileInfo-Label-Container'>
                                                <label className='FileInfo-Label' title={props.file.name}>{props.file.name}</label>
                                            </div>
                                            <FaTrash
                                                className='TrashIcon'
                                                size={14}
                                                onClick={() => props.setFile(null)}/>
                                        </div>
                                    </div>: <label>no file uploaded</label>
                            }
                            <input
                                className='SubmitButton'
                                type='submit'
                                value='Submit'/>
                        </form> : <></>
                }
            </div>
            <div className='SearchForm-Description-Header'>
                {
                    showSearchForm ?
                        <>
                            <div>
                                <label>Description</label>
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                                et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
                                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                                diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                                takimata sanctus est Lorem ipsum dolor sit amet.
                            </p>
                        </> : <></>
                }
            </div>

        </div>
    )
}

export default SearchForm