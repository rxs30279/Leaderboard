import Plot from 'react-plotly.js';

const Static =()=>{

    let trace1 = {
        x: [0, 1, 2, 3, 4, 5, 6],
        y: [1, 9, 4, 7, 5, 2, 4],
        mode: 'markers',
        marker: {
            size: [20, 40, 25, 10, 60, 90, 30],
        }
    };
    return(
  
        <Plot   data = {[trace1]}
        
        layout = {{
            title: 'Create a Static Chart',
            showlegend: false
        }}
        config={{displayModeBar: false}}/>
    )
}

export default Static;