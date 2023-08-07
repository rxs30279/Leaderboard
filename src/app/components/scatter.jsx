import Plot from 'react-plotly.js';
import { useState } from "react"
import { HStack,Input, Text } from "@chakra-ui/react"


const GraphCard = (props) =>{

  const [ scatter, setScatter ] = useState(
    {
          x: [1,2,3],
          y: [2,5,3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'red'},
        }
  );
  const [ data, setData ] = useState([scatter]);

  const handleChange = (i,j,e) => {
    const newScatter = {...scatter};
    newScatter[i][j]=parseInt(e.target.value);
    setScatter(newScatter);
    setData([scatter]);
  }



    return(
      <>
      <Plot data={[{
            x: [data[0 ]["x"] [0],data[0 ]["x"] [1],data[0 ]["x"][2]],
            y: [data[0 ]["y"] [0],data[0 ]["y"] [1],data[0 ]["y"][2]],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }]} layout={ {width: 500, height: 500, title: 'A Dynamic Fancy Plot'} } />
    <HStack align="center" marginTop="2rem" padding="2rem">
      <Text fontSize="md">X1</Text>
      <Input type="number" placeholder={data [0 ]["x"][0]} onChange={(e) => handleChange("x",0,e)}/>
      <Text fontSize="md">X2</Text>
      <Input type="number" placeholder={data [0 ]["x"][1]} onChange={(e) => handleChange("x",1,e)}/>
      <Text fontSize="md">X3</Text>
      <Input type="number" placeholder={data [0 ]["x"][2]} onChange={(e) => handleChange("x",2,e)}/>
      <Text fontSize="md">Y1</Text>
      <Input type="number" placeholder={data [0 ]["y"][0]} onChange={(e) => handleChange("y",0,e)}/>
      <Text fontSize="md">Y2</Text>
      <Input type="number" placeholder={data [0 ]["x"][1]} onChange={(e) => handleChange("y",1,e)}/>
      <Text fontSize="md">Y3</Text>
      <Input type="number" placeholder={data [0 ]["x"][2]} onChange={(e) => handleChange("y",2,e)}/>
    </HStack>
      </>
    )
}

export default GraphCard;