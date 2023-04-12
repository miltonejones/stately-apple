
import { useState } from 'react';

export default function TextGenerator() {
  const [text, setText] = useState('');


  const generateText = async (options) => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        "messages": [{"role": "user", "content": 'Write a react component that has a textfield and a button. clicking the button sets the value of the textfield to 1000.'}],
        "temperature": 0.7, 
        "model": "gpt-3.5-turbo",
        max_tokens: 1024, 
      }),
    };
    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions );
    const json = await response.json();
    console.log ({
      json
    })
    setText(json)
    return json;
  };
 
 

  return (
    <div>
      <button onClick={generateText}>Generate Text</button>
    { text.choices[0].message.content}
     <pre>
     {JSON.stringify(text.choices[0],0,2)}
     </pre>
    </div>
  );
}
