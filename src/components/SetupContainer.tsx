import 'bootstrap/dist/css/bootstrap.min.css';

import {SetStateAction, useState, useEffect } from "react";
import {Card, ProgressBar} from 'react-bootstrap';

import Graph from "graphology";
import Sigma from "sigma";

import circular from "graphology-layout/circular";
import forceAtlas2 from "graphology-layout-forceatlas2";


import {v4 as uuid} from 'uuid';

import axios from "axios";

type SetupContainerProps = {
    setData: Function,
    setCommonWords: Function,
    setDocuments: Function,
    setId: Function
}

export const SetupContainer = ({setData, setCommonWords, setDocuments, setId} : SetupContainerProps) => {

    const url = 'http://localhost:8000/api/posts/';
    const status_url = 'http://localhost:8000/api/status/';

    const [keywords, setKeywords] = useState("");


    const [running, setRunning] = useState(false);
    const [actualState, setActualState] = useState(0);
    const [actualStateLabel, setActualStateLabel] = useState("");

    async function getRequestStatus(id:string) {
        await axios.get(status_url, {
            params: {
                id: id
            }})
            .then((res: { data: any; }) => {
                let data = res.data;
                let files_all = data["files_all"];
                let files_ready = data["files_ready"];
                if (files_all > 0)
                {
                    let factor = files_ready/files_all;
                    setActualState(factor * 100);
                    setActualStateLabel(files_ready + "/" + files_all);

                    if (files_all === files_ready)
                    {
                        setRunning(false);
                    }
                }
                else
                {
                    setActualState(0);
                    setActualStateLabel("0");
                }
            })
            .catch(error =>
            {
                console.log(error);
                setRunning(false);
            })
        await delay(100)
    }

    async function checkState(id: string) {
        while (loadingState)
        {
            await getRequestStatus(id);
            await delay(100);
        }
    }

    async function uploadFile(form_data: FormData) {
        await axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
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

                loadingState = false;
            })
            .catch((err: { toString: () => any; }) => {
                setData({
                    hasError: true,
                    error: err.toString(),
                    response: {}
                });
                loadingState = false;
                alert(err.toString())
            })
    }

    function delay(time: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    let loadingState = false;

    const handleFileChanged = (e: any) => {
        let id = uuid();

        setRunning(true);
        loadingState = true;

        let form_data = new FormData();
        form_data.append('archive', e.target.files[0], e.target.files[0].name);
        form_data.append('id', id);
        form_data.append('keywords', keywords);

        setId(id);



        Promise.all(
            [
                checkState(id),
                uploadFile(form_data)
            ]
        ).then(async r => {
            await getRequestStatus(id);
        })
    };

    return(
        <div className="setup-container">
            <div className="SetupStep">
                <form>
                    <input
                        type="file"
                        onChange={handleFileChanged}
                        required/>
                </form>

            </div>
            <div className="separator"/>
            <div className="SetupStep">
                <div>{running ? "Running..." : ""}</div>
                <ProgressBar style={{width: 200, height: 24, marginLeft: 16, marginRight: 16}} now={actualState} label={actualStateLabel} />
                <div>{Math.round(actualState)}%</div>
            </div>
        </div>
    );
}
