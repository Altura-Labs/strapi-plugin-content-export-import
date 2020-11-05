import React, {useState} from 'react';
import {Button} from "strapi-helper-plugin";
import {saveAs} from "file-saver";
import {fetchEntries} from "../../utils/contentApis";
import {HFlex, ModelItem} from "./ui-components";
import JsonDataDisplay from "../../components/JsonDataDisplay";

const ExportModel = ({model}) => {
  const [fetching, setFetching] = useState(false);
  const [content, setContent] = useState(null);
  const fetchModelData = () => {
    setFetching(true);
    fetchEntries(model.apiID, model.schema.kind).then((data) => {
      setContent(data);
    }).finally(() => {
      setFetching(false);
    });
  };

  const downloadCsv = () => {
    var json = content
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value }
    var csv = json.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    const current = new Date();
    const file = new File([csv],
      `${model.apiID}-${current.getTime()}.csv`,
      {type: "text/csv;charset=utf-8"});
    saveAs(file);
  };
  return (<ModelItem>
    <HFlex>
      <span className='title'>{model.schema.name}</span>
      <div>
        <Button disabled={fetching}
                loader={fetching}
                onClick={fetchModelData}
                secondaryHotline>{fetching ? "Fetching" : "Fetch"}</Button>
        <Button disabled={!content}
                onClick={downloadCsv}
                kind={content ? 'secondaryHotline' : 'secondary'}
        >Download</Button>
      </div>
    </HFlex>
    {
      content && (<JsonDataDisplay data={content}/>)
    }
  </ModelItem>)
};

export default ExportModel;
