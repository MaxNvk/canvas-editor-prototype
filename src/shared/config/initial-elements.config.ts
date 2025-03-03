import type { Node } from "@xyflow/react";

export const initialNodes: Node[] = [
  {
    id: '2',
    position: { x: 0, y: 0 },
    type: "dataSchema",
    data: {
      label: "Ammonia from H2 from Coal Gasification w/ CC S",
      details: "Life Cycle Assessment of Corn based Butanol as a transportation fuel",
      bgColor: "#bfdbff",
      isExpanded: true,
      lastUpdated: 1740989832130,
      schema: {
        input: [
          {
            title: "Nitrogen Gas",
            description: "Mix: Nitrogen products from cryogenic",
            value: "75%",
          },
          {
            title: "Gaseous Hydrogen",
            description: "Pathway: Central PlantsL. Compressed G.H2",
            value: "10%",
          },
          {
            title: "Electricity",
            description: "Pathway: Distributed - U.S. Mix",
            value: "15%",
          },
        ],
        output: [
          {
            title: "Lime",
            value: "18%",
          },
          {
            title: "Ammonia for Fuel",
            value: "80%",
          }
        ]
      }
    }
  },
  {
    id: '3',
    position: { x: 600, y: 0 },
    type: "dataSchema",
    data: {
      label: "Ammonia Transportation and Distribution",
      details: "Analysis of Petroleum Refining",
      bgColor: "#ffe54e",
      isExpanded: true,
      lastUpdated: 1740987832130,
      schema: {
        input: [
          {
            title: "Ammonia for Fuel",
            value: "100%",
          },
          {
            title: "Gaseous Hydrogen",
            description: "Pathway: Central PlantsL. Compressed G.H2",
            value: "10%",
          },
          {
            title: "Electricity",
            description: "Pathway: Distributed - U.S. Mix",
            value: "15%",
          },
          {
            title: "Residual Oil",
            description: "Pathway: Residual Oil (Petroleum) from Crude Oil",
            value: "0.00%",
          },
        ],
        output: [
          {
            title: "Lime",
            value: "18%",
          },
          {
            title: "Ammonia for Fuel",
            value: "80%",
          }
        ]
      }
    }
  },
];
