import { useState } from 'react'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import Keyword from "./Keyword";

const keywords = [
    {
        id:'1',
        label:'Lorem'
    },
    {
        id:'2',
        label:'ipsum'
    },
    {
        id:'3',
        label:'dolor'
    },
    {
        id:'4',
        label:'sit'
    },
    {
        id:'5',
        label:'amet'
    },
    {
        id:'6',
        label:'consetetur'
    },
    {
        id:'7',
        label:'sadipscing'
    },
    {
        id:'8',
        label:'elitr'
    },
    {
        id:'9',
        label:'sed'
    },
    {
        id:'10',
        label:'diam'
    }
]

const Keywords = () => {

    const [showKeywords, setShowKeywords] = useState(true)

    return (
        <div className={`Keywords-Container ${showKeywords && 'Open'}`}>
            <div className='Keywords-Header'>
                {
                    showKeywords ? <FaAngleDoubleRight
                            className='AngleIconButton'
                            onClick={() => setShowKeywords(!showKeywords)}/> :
                        <FaAngleDoubleLeft
                            className='AngleIconButton'
                            onClick={() => setShowKeywords(!showKeywords)}/>
                }
                {
                    showKeywords ? <label>Suggested Keywords</label> : <></>
                }
            </div>
            <div>
                {
                    showKeywords ? keywords.map((keyword) => <Keyword keyword={keyword}/>) : <></>
                }
            </div>
        </div>
    )
}

export default Keywords