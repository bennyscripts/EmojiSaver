const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');

module.exports = ({ getSetting, updateSetting, toggleSetting }) => (
  <div>
    <TextInput
      note='The path to where emojis will be saved.'
      defaultValue={getSetting('downloadPath', '')}
      required={true}
      onChange={val => updateSetting('downloadPath', val.endsWith('/') ? val.slice(0, -1) : val)}
    >
      Download Path
    </TextInput> 
  </div>
);
