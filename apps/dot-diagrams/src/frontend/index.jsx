import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Image, Label, SectionMessage, Text, TextArea, useConfig } from '@forge/react';
import { invoke } from '@forge/bridge';

const EXAMPLE = 'digraph G {\n  Idea -> Draft -> Review -> Published\n}';

const App = () => {
  const config = useConfig();
  const dot = (config && config.dot) || EXAMPLE;
  const [result, setResult] = useState(null);
  useEffect(() => {
    let live = true;
    invoke('render', { dot }).then((r) => live && setResult(r));
    return () => { live = false; };
  }, [dot]);
  if (!result) return <Text>Drawing...</Text>;
  if (result.error) {
    return (
      <SectionMessage appearance="error">
        <Text>{result.error}</Text>
      </SectionMessage>
    );
  }
  return <Image src={result.src} alt="Diagram" width={result.width} />;
};

const Config = () => (
  <>
    <Label labelFor="dot">DOT text</Label>
    <TextArea id="dot" name="dot" defaultValue={EXAMPLE} />
  </>
);

ForgeReconciler.render(<React.StrictMode><App /></React.StrictMode>);
ForgeReconciler.addConfig(<Config />);
