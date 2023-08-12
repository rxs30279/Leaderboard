
import Plot from 'react-plotly.js';
import styles from "../page.module.css";

function PlotlyComponent(props) {
    const {combinedArray} = props;
   


    const data = [
      {
        x: combinedArray.map(item => item.symbol),
        y: combinedArray.map(item => item.holding * item.price),
        type: 'bar',
        marker: {color: ['#FF3DD3','#FAFF0B','#3CFF0F','rgba(191, 11, 255, 0.91)','#FFA203'] },
       
      }
    ];

    return (
        <div className={'styles.graph_container'} >
             <Plot 
             config={{displayModeBar: false}}
        data={data}
       layout={ {   margin: {
        l: 40,
        r: 10,
        b: 50,
        t: 50,
        pad: 5
      },font:{color: 'white'}, width: 330, height: 420,paper_bgcolor: 'rgba(4, 130, 255, 0.20)', plot_bgcolor: "rgba(4, 130, 255, 0.20)",} } />

      
    
        </div>
    )
}

export default PlotlyComponent;