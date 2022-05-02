import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';

type Recall = {
  [key: string]: string;
};
interface Props {
  recalls: Recall[];
}
export default class NetworkWhisper {
  whisper: whisper.Whisper;
  label: string;
  props: Props;

  constructor(recalls: Recall[]) {
    this.whisper = undefined;
    this.label = 'Org Alerts';
    this.props = {
      recalls,
    };
  }
  createComponents() {
    const components = [];
    this.props.recalls.forEach((recall) => {
      components.push({
        type: whisper.WhisperComponentType.Message,
        // text: `${recall.last_updated} : ${recall.entity} - ${recall.unit} : ${recall.status} - ${recall.message} \n\n`,
        body: `${recall.last_updated} : ${recall.entity} - ${recall.unit} : ${recall.status} - ${recall.message} \n\n`,
        style: whisper.Urgency.None,
        // onClick: () => {
        //   const markdown = stripIndent`
        //   # ALERT
        //   ${recall.last_updated} :-
        //   ${recall.message}
        //   `;

        //   whisper.create({
        //     label: `Alert for ${recall.unit}`,
        //     components: [
        //       {
        //         type: whisper.WhisperComponentType.Markdown,
        //         body: markdown,
        //       },
        //     ],
        //   });
        // },
      });
    });

    return components;
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: NetworkWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(NetworkWhisper.onClose);
  }

  static onClose(err?: Error) {
    if (err) {
      console.error('There was an error closing Network whisper', err);
    }
    // console.log('Network whisper closed');
  }
}
