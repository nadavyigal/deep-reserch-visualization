import React from 'react';
import Link from 'next/link';
import SimpleChartGenerator from '../components/SimpleChartGenerator';
import FlowchartGenerator from '../components/FlowchartGenerator';
import AnimationGenerator from '../components/AnimationGenerator';

export const metadata = {
  title: 'Visualization Examples | Deep Research Visualization',
  description: 'Examples of graphs, flowcharts, and animations for research visualization',
};

export default function ExamplesPage() {
  // Example data for visualizations
  const graphExamples = [
    {
      title: "Research Publication Trends",
      data: `Year,AI,Machine Learning,Deep Learning,Natural Language Processing
2018,45,60,30,25
2019,55,65,40,35
2020,70,75,55,50
2021,90,85,75,70
2022,120,95,90,85`,
      type: "line",
    },
    {
      title: "Citation Distribution by Field",
      data: `Field,Citations
Computer Science,1250
Biology,980
Physics,870
Chemistry,750
Psychology,620
Economics,580`,
      type: "bar",
    },
    {
      title: "Research Funding Allocation",
      data: `Category,Percentage
AI and Machine Learning,35
Healthcare Research,25
Climate Science,20
Materials Science,12
Other Fields,8`,
      type: "pie",
    },
    {
      title: "Experiment Success Rate",
      data: `Method,Success Rate
Method A,78
Method B,65
Method C,92
Method D,45`,
      type: "bar",
    },
  ];

  const flowchartExamples = [
    {
      title: "Research Methodology",
      data: `graph TD
    A[Research Question] --> B[Literature Review]
    B --> C[Hypothesis Formation]
    C --> D[Experimental Design]
    D --> E[Data Collection]
    E --> F[Data Analysis]
    F --> G[Results Interpretation]
    G --> H[Conclusion]
    H --> I[Publication]`,
    },
    {
      title: "Machine Learning Pipeline",
      data: `graph LR
    A[Data Collection] --> B[Data Preprocessing]
    B --> C[Feature Engineering]
    C --> D[Model Selection]
    D --> E[Model Training]
    E --> F[Model Evaluation]
    F --> G[Hyperparameter Tuning]
    G --> E
    F --> H[Model Deployment]
    H --> I[Monitoring]`,
    },
    {
      title: "Peer Review Process",
      data: `graph TD
    A[Manuscript Submission] --> B[Editor Assessment]
    B --> C{Suitable for Journal?}
    C -->|Yes| D[Assign Reviewers]
    C -->|No| E[Reject]
    D --> F[Peer Review]
    F --> G{Decision}
    G -->|Accept| H[Publication]
    G -->|Revise| I[Author Revision]
    I --> F
    G -->|Reject| E`,
    },
    {
      title: "Data Analysis Workflow",
      data: `graph TD
    A[Raw Data] --> B[Data Cleaning]
    B --> C[Exploratory Analysis]
    C --> D{Quality Check}
    D -->|Pass| E[Statistical Analysis]
    D -->|Fail| B
    E --> F[Visualization]
    F --> G[Interpretation]
    G --> H[Report Generation]`,
    },
  ];

  const animationExamples = [
    {
      title: "Neural Network Learning Process",
      text: "Neural networks learn through a process called backpropagation. Input data passes through layers of neurons, each applying weights and activation functions. The network compares its output to the expected result, calculates the error, and adjusts weights accordingly. This process repeats iteratively, gradually improving the model's accuracy over time.",
    },
    {
      title: "Climate Change Impact Factors",
      text: "Climate change is influenced by multiple interconnected factors. Greenhouse gas emissions from industrial activities, transportation, and agriculture trap heat in the atmosphere. Deforestation reduces carbon absorption capacity. Ocean acidification affects marine ecosystems. Rising temperatures lead to melting ice caps, rising sea levels, and extreme weather events, creating feedback loops that further accelerate climate change.",
    },
    {
      title: "Immune System Response",
      text: "The immune system defends the body through a complex series of responses. When pathogens enter the body, innate immunity provides immediate, non-specific defense. Dendritic cells present antigens to T cells, activating adaptive immunity. B cells produce antibodies specific to the pathogen. Memory cells remain after infection, providing faster response to future encounters with the same pathogen.",
    },
    {
      title: "Quantum Computing Principles",
      text: "Quantum computing leverages quantum mechanics principles to process information. Unlike classical bits, quantum bits (qubits) can exist in superposition, representing both 0 and 1 simultaneously. Quantum entanglement allows qubits to be correlated, regardless of distance. These properties enable quantum computers to solve certain problems exponentially faster than classical computers, particularly in cryptography, optimization, and simulation of quantum systems.",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Visualization Examples</h1>
        <p className="text-gray-600 mb-4">
          Explore different types of visualizations for research data and concepts
        </p>
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Graphs Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Graphs</h2>
        <p className="mb-6 text-gray-700">
          Graphs provide quantitative visualization of data relationships, trends, and distributions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {graphExamples.map((example, index) => (
            <div key={`graph-${index}`} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{example.title}</h3>
              <div className="h-64">
                <SimpleChartGenerator 
                  data={example.data}
                  type={example.type as any}
                  title={example.title}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flowcharts Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Flowcharts</h2>
        <p className="mb-6 text-gray-700">
          Flowcharts illustrate processes, workflows, and decision paths in a structured visual format.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {flowchartExamples.map((example, index) => (
            <div key={`flowchart-${index}`} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{example.title}</h3>
              <div className="h-64 overflow-auto">
                <FlowchartGenerator 
                  initialCode={example.data}
                  height={256}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animations Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Animations</h2>
        <p className="mb-6 text-gray-700">
          Animations bring concepts to life through dynamic visual representations of key ideas and processes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {animationExamples.map((example, index) => (
            <div key={`animation-${index}`} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{example.title}</h3>
              <AnimationGenerator 
                text={example.text}
                section={example.title}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}