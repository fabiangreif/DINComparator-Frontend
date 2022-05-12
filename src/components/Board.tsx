import {useState, useEffect} from "react";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import ArticleIcon from '@mui/icons-material/Article';
import LinkIcon from '@mui/icons-material/Link';

import {Title} from "./Title";
import {SetupContainer} from "./SetupContainer";
import axios from "axios";
import Graph from "graphology";
import circular from "graphology-layout/circular";
import forceAtlas2 from "graphology-layout-forceatlas2";
import Sigma from "sigma";

export const Board = () => {

    const [isLoading, setIsLoading] = useState(false);

    const hhhh = window.innerHeight
    const [data, setData] = useState({
        hasError: false,
        error: "",
        response: {}
    })

    const [screenSize, getDimension] = useState({
        dynamicWidth: window.innerWidth,
        dynamicHeight: window.innerHeight
    });
    const setDimension = () => {
        getDimension({
            dynamicWidth: window.innerWidth,
            dynamicHeight: window.innerHeight
        })
    }

    useEffect(() => {
        window.addEventListener('resize', setDimension);

        return(() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenSize])

    const parent = document.getElementById('parent');
    const lolheight = parent == null ? 200 : parent.clientHeight;

    const [id, setId] = useState("")

    const [commonWords, setCommonWords] = useState([""]);

    const [keywords, setKeywords] = useState("");
    const [documents, setDocuments] = useState([
        {
            "id": "",
            "title": "",
            "size": 0,
            "color": "",
            "is_reference": true,
        }]);

    const url = 'http://localhost:8000/api/posts/';

    const onSubmit = async (e: any) => {
        e.preventDefault();

        await axios.get(url, {
            params: {
                id: id,
                keywords: keywords
            }
        })
            .then((res: { data: any; }) => {
                setData({
                    hasError: false,
                    error: "",
                    response: res.data
                });

                const container = document.getElementById("sigma-container");
                if (container != null) {
                    container.innerHTML = "";
                }
                const graph = new Graph();
                const commonWords: string[] = [];

                const documents: { id: string; title: string; size: number; color: string; is_reference: boolean; }[] = [];

                res.data["nodes"].forEach((node: { id: string, size:number, title:string, color:string, is_reference:boolean}) => {
                    console.log(node["id"])
                    graph.addNode(node["id"], {  size: parseFloat(node["size"].toString()), label: node["title"], color: node["color"] });
                    documents.push({
                        "id": node["id"],
                        "title": node["title"],
                        "size": node["size"],
                        "color": node["color"],
                        "is_reference": node["is_reference"]
                    });
                })

                res.data["edges"].forEach((edge: {left:string, right:string}) => {
                    console.log("$" + edge["left"] + "###" + edge["right"] + "$")
                    graph.addEdge(edge["left"], edge["right"]);
                })

                res.data["commonWords"].forEach((x:string) => {
                    commonWords.push(x);
                })

                circular.assign(graph);
                const settings = forceAtlas2.inferSettings(graph);
                forceAtlas2.assign(graph, { settings, iterations: 600 });


                const renderer = new Sigma(graph, container as HTMLElement);

                setCommonWords(commonWords);
                setDocuments(documents);

            })
            .catch(error => console.log(error))

    };

    return(
        <div className="board-container">
            <Title/>
            <SetupContainer setData={setData} setCommonWords={setCommonWords} setDocuments={setDocuments} setId={setId}/>
            <div className="wrapper">
                <div className="graph-container card-container">
                    <h2 className="card-title title-large">Documents Graph</h2>
                    <div id="sigma-container"/>

                </div>
                <div className="document-container card-container" style={{
                    height: screenSize.dynamicHeight -76 - 16 - 48 - 16 -16
                }}>
                    <h2 className="card-title title-large">Documents</h2>
                    <div className="document-list" id="style-4" style={{paddingLeft: 16, paddingTop: 16}}>
                        {documents
                            .sort((a,b) => a.size < b.size ? 1 : -1)
                            .map(document => <div className="list-item" style={{marginBottom: 4}}><div className="icon-container">{document.is_reference ? <LinkIcon/> : <ArticleIcon/>}</div><div className="label-container">{document.id}</div></div>)}
                    </div>
                </div>
                <aside className="aside aside-2">
                    <div className="search-container card-container">
                        <h2 className="card-title title-large">Keywords</h2>
                        <div className="keyword-search">
                            <form onSubmit={onSubmit}>
                                <input value={keywords}
                                       type='text'
                                       style={{marginLeft: 16, marginTop: 16}}
                                       onChange={(e) => setKeywords(e.target.value)}/>
                                <input style={{marginLeft: 16, marginTop: 8}} type="submit"/>
                            </form>
                        </div>
                    </div>

                    <div className="suggested-words card-container" style={{
                        height: screenSize.dynamicHeight - 400 + 48 +16 -2
                    }}>
                        <h2 className="card-title title-large">Suggested Words</h2>
                        <div className="words-list" id="style-4" style={{paddingTop: 16, paddingLeft: 16}}>
                            {commonWords.map(txt => <div style={{marginBottom: 4}}>{txt}</div>)}
                        </div>

                    </div>
                </aside>
            </div>

        </div>
    );
}
