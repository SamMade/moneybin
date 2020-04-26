import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { uid } from 'react-uid';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const color = scaleOrdinal(schemeCategory10);

export default function Sankey({ nodes, links, width, height }) {
  const SankeyChart = useRef();
  const [sankeyElements, setSankeyElements] = useState([[], []]);

  useEffect(() => {
    SankeyChart.current = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]])
      .nodeId((d) => d.id);
  }, []);

  useEffect(() => {
    if (!nodes || nodes.length === 0|| !links || links.length === 0) { return; }

    // sankey mutates the data going into it
    const cloneData = {
      nodes: cloneDeep(nodes),
      links: cloneDeep(links),
    };
    const {nodes: sankeyNodes, links: sankeyLinks} = SankeyChart.current(cloneData);

    setSankeyElements([sankeyNodes, sankeyLinks]);
  }, [nodes, links])

  return (
    <div>
      <svg width={width} height={height}>
        <g style={{ mixBlendMode: 'multiply' }}>
          {sankeyElements[0].map((d, i) => (
            <Rect
              key={d.name}
              {...d}
              fill={color(d.name)}
              title={`${d.name}\n${`$${d.value}`}`}
            />
          ))}
          {sankeyElements[1].map((link, i) => (
            <Path
              key={uid(link)}
              link={link}
              color={color(link.target.name)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

Sankey.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    source: PropTypes.string,
    target: PropTypes.string,
  })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

Sankey.defaultProps = {
  width: 600,
  height: 200,
}

const Rect = ({title, x0, x1, y0, y1, fill}) => {
  return (
    <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={fill}>
      <title>{title}</title>
    </rect>
  )
};

const Path = ({ link, color }) => (
  <path
    d={sankeyLinkHorizontal()(link)}
    style={{
      fill: 'none',
      strokeOpacity: '.3',
      stroke: color,
      strokeWidth: Math.max(1, link.width),
    }}
  />
)