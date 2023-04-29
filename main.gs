// https://habitica.com/apidoc/

const USER_ID = '<your id>';
const USER_TOKEN = '<your token>';
const SCRIPT_NAME = 'Habitica - Exceeded Max MP report';

const HEADERS = {
  'x-client': USER_ID + ' - ' + SCRIPT_NAME,
  'x-api-user': USER_ID,
  'x-api-key': USER_TOKEN
};


function formatMember(member) {
  return `- ${member.mp}/${member.maxMP} : ${member.name}`;
}


function getExceededMembers() {
  const resp = UrlFetchApp.fetch(`https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true`, { headers: HEADERS });
  const data = JSON.parse(resp.getContentText()).data;
  const members = [];
  data.forEach(x => {
    if (x.stats.mp > x.stats.maxMP) {
      members.push({ id: x.id, name: x.profile.name, mp: parseInt(x.stats.mp), maxMp: parseInt(x.stats.maxMP) });
    }
  });
  members.sort((a, b) => a.mp - b.mp);

  return members;
}

function makeReport(members) {
  const result = [
    '### Members with Exceeded Max Mana',
	'(use skills before checking off any tasks, dailies, or to-dos!)'
    '-----',
   ...members.map(x => `- ${x.name} : ${x.mp}/${x.maxMP}`),
  ];
  return result.join('\n');
}

function postChatMessage(message) {
  const resp = UrlFetchApp.fetch('https://habitica.com/api/v3/groups/party/chat', {
    method: 'POST',
    headers: HEADERS,
    payload: { message }
  });
  Logger.log('Message sent.');
  }
}



function main() {
  const members = getExceededMembers();
  if (members.length) {
    const report
    postChatMessage(report);
  } else {
    Logger.log('No members have exceeded their maximum MP cap.');
  }
}

