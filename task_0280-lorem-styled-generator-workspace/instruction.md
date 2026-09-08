# Generated text changes identity while I prepare the next generation

I'm running into a confusing state problem when I generate some text and then start setting up the next one. For example, I can generate Pirate Speak, then switch the controls to Sci-Fi and a different quantity without pressing Generate again. The Pirate text is still the document on screen, but parts of the output start presenting it as Sci-Fi. At that point I can't tell whether the controls describe the text I'm looking at or only the text I'm about to generate.

I need those two ideas to stay separate. The flavor, quantity, and unit controls are the current draft settings for the next generation. Once text has been generated, the output should keep the identity of the settings that actually produced it until another document replaces it. Changing the draft controls alone must not rewrite the identity of text that already exists. That includes the flavor label and the word-cloud styling as well as the text itself.

This becomes especially important once I move through previous generations. Undo and Redo should restore a generated document as one coherent snapshot rather than mixing its text with settings from something I selected later. The same applies when I restore an item from History: its text, flavor, quantity, and unit belong together. If I undo that restore, I should get back the document I was viewing before it, and redo should return to the restored document. The keyboard shortcuts should follow the same history as the buttons.

Preparing different controls while I'm sitting on an undone document should not silently alter that document either. If I redo, I expect the exact document I previously undid to return with the identity it had when it was generated. If instead I actually Generate a different document after undoing, that is a new branch and the abandoned redo path should no longer come back.

Reloading the page shouldn't collapse the distinction between the current draft controls and the generated document. If I generate Cat Ipsum, then change the controls to Hipster Ipsum without generating again and reload, the controls can still show the Hipster settings I was preparing, but the existing output must still be recognisable as the Cat Ipsum document that produced that text.

The broken app currently looks like this:

<img src="/app/problem_assets/broken.png" alt="Generated text is presented with the identity of newer draft controls" width="900" />

The expected app should look like this:

<img src="/app/problem_assets/target.png" alt="Generated text keeps its own flavor identity while newer draft controls remain selected" width="900" />
