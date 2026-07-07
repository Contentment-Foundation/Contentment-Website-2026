const TRACKER_CONFIG = {
  SPREADSHEET_ID: '18_WjO7OrCNUrcciBpjqEA90dzbhvKEeEzgC2B4fRGJk',
  WEEKLY_SUMMARY_DAY: ScriptApp.WeekDay.MONDAY,
  WEEKLY_SUMMARY_HOUR: 9,
  EMAIL_DOMAIN: 'contentment.org',
  TEAM_MEMBERS: ['somesh', 'kristina', 'nav', 'dave', 'woei', 'cika', 'lorna', 'pamila', 'anik'],
  SHEETS: {
    ISSUES: 'issues',
    COMMENTS: 'comments',
    DECISIONS: 'decisions',
    ACTIVITY: 'activity_log',
    LOOKUPS: 'lookups',
  },
};

const ISSUE_HEADERS = [
  'id',
  'title',
  'description',
  'type',
  'phase',
  'priority',
  'status',
  'owner',
  'start_date',
  'due_date',
  'timeline_note',
  'depends_on',
  'blocker',
  'attachments',
  'context',
  'source_ticket',
  'updated_by',
  'updated_at',
];

const COMMENT_HEADERS = [
  'comment_id',
  'issue_id',
  'comment_text',
  'author_email',
  'created_at',
];

const DECISION_HEADERS = [
  'decision_id',
  'topic',
  'status',
  'owner',
  'impact',
  'notes',
  'updated_by',
  'updated_at',
];

const ACTIVITY_HEADERS = [
  'event_id',
  'entity_type',
  'entity_id',
  'action',
  'old_value',
  'new_value',
  'actor_email',
  'at',
];

function doGet() {
  var email = getCurrentUser_();
  if (!isAuthorizedUser_(email)) {
    return HtmlService.createHtmlOutput(
      '<p>Access restricted to ' + TRACKER_CONFIG.EMAIL_DOMAIN + ' accounts. Signed in as: ' + (email || 'unknown') + '</p>'
    );
  }
  ensureSchema_();
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Contentment Tracker Board')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getCurrentUser_() {
  return Session.getActiveUser().getEmail() || 'unknown@user';
}

function isAuthorizedUser_(email) {
  return !!email && email.toLowerCase().indexOf('@' + TRACKER_CONFIG.EMAIL_DOMAIN.toLowerCase()) !== -1;
}

function assertAuthorized_() {
  var email = getCurrentUser_();
  if (!isAuthorizedUser_(email)) {
    throw new Error('Not authorized: this tracker is restricted to ' + TRACKER_CONFIG.EMAIL_DOMAIN + ' accounts.');
  }
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function nowIso_() {
  return new Date().toISOString();
}

function openSheet_() {
  return SpreadsheetApp.openById(TRACKER_CONFIG.SPREADSHEET_ID);
}

function ensureHeader_(sheet, headers) {
  const row = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const same = headers.every(function (h, i) {
    return row[i] === h;
  });
  if (!same) {
    // Only fix the header row itself — never clear the sheet, or a stray
    // manual edit to row 1 would wipe every existing issue/comment/decision.
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function ensureSchema_() {
  const ss = openSheet_();
  const tabs = TRACKER_CONFIG.SHEETS;
  const defs = {};
  defs[tabs.ISSUES] = ISSUE_HEADERS;
  defs[tabs.COMMENTS] = COMMENT_HEADERS;
  defs[tabs.DECISIONS] = DECISION_HEADERS;
  defs[tabs.ACTIVITY] = ACTIVITY_HEADERS;
  defs[tabs.LOOKUPS] = ['key', 'value'];

  Object.keys(defs).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    ensureHeader_(sh, defs[name]);
  });
}

function rowObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map(function (row, idx) {
    const obj = { _row: idx + 2 };
    headers.forEach(function (h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
}

function nextIssueId_(rows, type) {
  var prefix = (type || 'FEAT').toUpperCase();
  var re = new RegExp('^' + prefix + '-(\\d+)$');
  var maxNum = 0;
  rows.forEach(function (r) {
    var id = String(r.id || '').toUpperCase();
    var m = id.match(re);
    if (m) {
      var n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  });
  var next = maxNum + 1;
  return prefix + '-' + String(next).padStart(3, '0');
}

function logActivity_(entityType, entityId, action, oldValue, newValue) {
  const ss = openSheet_();
  const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.ACTIVITY);
  sh.appendRow([
    Utilities.getUuid(),
    entityType,
    entityId,
    action,
    oldValue || '',
    newValue || '',
    getCurrentUser_(),
    nowIso_(),
  ]);
}

function getBoardData() {
  assertAuthorized_();
  ensureSchema_();
  const ss = openSheet_();
  const issues = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES));
  const comments = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.COMMENTS));
  const decisions = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.DECISIONS));
  const activity = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.ACTIVITY))
    .sort(function (a, b) {
      return String(b.at || '').localeCompare(String(a.at || ''));
    })
    .slice(0, 50);
  const owners = {};
  issues.forEach(function (i) {
    if (i.owner) owners[i.owner] = true;
  });
  decisions.forEach(function (d) {
    if (d.owner) owners[d.owner] = true;
  });

  return {
    userEmail: getCurrentUser_(),
    issues: issues,
    comments: comments,
    decisions: decisions,
    activity: activity,
    owners: Object.keys(owners).sort(),
    teamMembers: TRACKER_CONFIG.TEAM_MEMBERS,
    statuses: ['Open', 'In Progress', 'Blocked', 'Pending', 'Done', 'Scheduled', 'Paused'],
    priorities: ['Must', 'Should', 'Nice', 'Critical', 'High', 'Medium', 'Low'],
    decisionStatuses: ['Open', 'Recommended', 'Resolved'],
    weeklyRecipient: PropertiesService.getScriptProperties().getProperty('WEEKLY_SUMMARY_RECIPIENT') || '',
  };
}

function updateIssueStatus(issueId, newStatus) {
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES);
    const rows = rowObjects_(sh);
    const issue = rows.find(function (r) {
      return r.id === issueId;
    });
    if (!issue) throw new Error('Issue not found: ' + issueId);

    const old = issue.status || '';
    sh.getRange(issue._row, ISSUE_HEADERS.indexOf('status') + 1).setValue(newStatus);
    sh.getRange(issue._row, ISSUE_HEADERS.indexOf('updated_by') + 1).setValue(getCurrentUser_());
    sh.getRange(issue._row, ISSUE_HEADERS.indexOf('updated_at') + 1).setValue(nowIso_());
    logActivity_('issue', issueId, 'status_change', old, newStatus);
    return { ok: true };
  });
}

function addComment(issueId, text) {
  if (!text || !String(text).trim()) throw new Error('Comment cannot be empty');
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.COMMENTS);
    const commentId = Utilities.getUuid();
    sh.appendRow([commentId, issueId, String(text).trim(), getCurrentUser_(), nowIso_()]);
    logActivity_('comment', commentId, 'create', '', String(text).trim());
    return { ok: true, comment_id: commentId };
  });
}

function upsertIssue(payload) {
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES);
    const rows = rowObjects_(sh);
    const type = payload.type || 'FEAT';
    const id = payload.id || nextIssueId_(rows, type);
    const existing = rows.find(function (r) {
      return r.id === id;
    });

    const normalized = {
      id: id,
      title: payload.title || '',
      description: payload.description || '',
      type: type,
      phase: payload.phase || '1',
      priority: payload.priority || 'Must',
      status: payload.status || 'Open',
      owner: normalizeOwnerInput_(payload.owner || ''),
      start_date: payload.start_date || '',
      due_date: payload.due_date || '',
      timeline_note: payload.timeline_note || '',
      depends_on: payload.depends_on || '',
      blocker: payload.blocker || '',
      attachments: payload.attachments || '',
      context: payload.context || '',
      source_ticket: payload.source_ticket || '',
      updated_by: getCurrentUser_(),
      updated_at: nowIso_(),
    };

    const values = ISSUE_HEADERS.map(function (h) {
      return normalized[h];
    });

    if (existing) {
      sh.getRange(existing._row, 1, 1, ISSUE_HEADERS.length).setValues([values]);
      logActivity_('issue', id, 'update', '', JSON.stringify(normalized));
    } else {
      sh.appendRow(values);
      logActivity_('issue', id, 'create', '', JSON.stringify(normalized));
    }
    return { ok: true, id: id };
  });
}

function upsertDecision(payload) {
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.DECISIONS);
    const rows = rowObjects_(sh);
    const id = payload.decision_id || payload.id || Utilities.getUuid();
    const existing = rows.find(function (r) {
      return r.decision_id === id;
    });

    const normalized = {
      decision_id: id,
      topic: payload.topic || '',
      status: payload.status || 'Open',
      owner: payload.owner || '',
      impact: payload.impact || '',
      notes: payload.notes || '',
      updated_by: getCurrentUser_(),
      updated_at: nowIso_(),
    };
    const values = DECISION_HEADERS.map(function (h) {
      return normalized[h];
    });

    if (existing) {
      sh.getRange(existing._row, 1, 1, DECISION_HEADERS.length).setValues([values]);
      logActivity_('decision', id, 'update', '', JSON.stringify(normalized));
    } else {
      sh.appendRow(values);
      logActivity_('decision', id, 'create', '', JSON.stringify(normalized));
    }
    return { ok: true, decision_id: id };
  });
}

function updateIssueField(issueId, field, value) {
  if (ISSUE_HEADERS.indexOf(field) === -1) throw new Error('Invalid field: ' + field);
  if (field === 'id') throw new Error('Cannot edit id');
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES);
    const rows = rowObjects_(sh);
    const issue = rows.find(function (r) {
      return r.id === issueId;
    });
    if (!issue) throw new Error('Issue not found: ' + issueId);
    const col = ISSUE_HEADERS.indexOf(field) + 1;
    const old = issue[field] || '';
    const finalValue = field === 'owner' ? normalizeOwnerInput_(value) : value;
    sh.getRange(issue._row, col).setValue(finalValue);
    sh.getRange(issue._row, ISSUE_HEADERS.indexOf('updated_by') + 1).setValue(getCurrentUser_());
    sh.getRange(issue._row, ISSUE_HEADERS.indexOf('updated_at') + 1).setValue(nowIso_());
    logActivity_('issue', issueId, 'field_change:' + field, old, String(finalValue || ''));
    return { ok: true };
  });
}

function updateDecisionNotes(decisionId, notes) {
  assertAuthorized_();
  return withLock_(function () {
    ensureSchema_();
    const ss = openSheet_();
    const sh = ss.getSheetByName(TRACKER_CONFIG.SHEETS.DECISIONS);
    const rows = rowObjects_(sh);
    const decision = rows.find(function (r) {
      return r.decision_id === decisionId;
    });
    if (!decision) throw new Error('Decision not found: ' + decisionId);
    const old = decision.notes || '';
    sh.getRange(decision._row, DECISION_HEADERS.indexOf('notes') + 1).setValue(notes || '');
    sh.getRange(decision._row, DECISION_HEADERS.indexOf('updated_by') + 1).setValue(getCurrentUser_());
    sh.getRange(decision._row, DECISION_HEADERS.indexOf('updated_at') + 1).setValue(nowIso_());
    logActivity_('decision', decisionId, 'notes_update', old, notes || '');
    return { ok: true };
  });
}

function csvEscape_(value) {
  const str = String(value == null ? '' : value);
  if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
  return str;
}

function getTrackerCsv() {
  assertAuthorized_();
  ensureSchema_();
  const ss = openSheet_();
  const issues = ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES).getDataRange().getValues();
  const decisions = ss.getSheetByName(TRACKER_CONFIG.SHEETS.DECISIONS).getDataRange().getValues();
  const comments = ss.getSheetByName(TRACKER_CONFIG.SHEETS.COMMENTS).getDataRange().getValues();
  const parts = [];
  parts.push('Issues');
  parts.push(issues.map(function (row) { return row.map(csvEscape_).join(','); }).join('\n'));
  parts.push('');
  parts.push('Decisions');
  parts.push(decisions.map(function (row) { return row.map(csvEscape_).join(','); }).join('\n'));
  parts.push('');
  parts.push('Comments');
  parts.push(comments.map(function (row) { return row.map(csvEscape_).join(','); }).join('\n'));
  return parts.join('\n');
}

function parseEmails_(input) {
  return String(input || '')
    .split(/[,\n; ]+/)
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(Boolean);
}

function setWeeklySummaryRecipient(emailsInput) {
  assertAuthorized_();
  const emails = parseEmails_(emailsInput).map(function (e) {
    return normalizeOwnerInput_(e);
  });
  if (!emails.length || emails.some(function (e) { return e.indexOf('@') < 0; })) {
    throw new Error('Provide one or more valid emails (comma-separated)');
  }
  const unique = Array.from(new Set(emails));
  PropertiesService.getScriptProperties().setProperty('WEEKLY_SUMMARY_RECIPIENT', unique.join(','));
  return { ok: true, recipients: unique };
}

function installWeeklySummaryTrigger() {
  assertAuthorized_();
  removeWeeklySummaryTrigger();
  ScriptApp.newTrigger('weeklySummaryCron')
    .timeBased()
    .onWeekDay(TRACKER_CONFIG.WEEKLY_SUMMARY_DAY)
    .atHour(TRACKER_CONFIG.WEEKLY_SUMMARY_HOUR)
    .create();
  return { ok: true };
}

function removeWeeklySummaryTrigger() {
  assertAuthorized_();
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'weeklySummaryCron') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  return { ok: true };
}

function weeklySummaryCron() {
  const recipients = PropertiesService.getScriptProperties().getProperty('WEEKLY_SUMMARY_RECIPIENT');
  if (!recipients) return { ok: false, reason: 'No recipient configured' };
  return sendWeeklySummaryEmail(recipients);
}

function sendWeeklySummaryEmail(recipient) {
  assertAuthorized_();
  ensureSchema_();
  const ss = openSheet_();
  const issues = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.ISSUES));
  const decisions = rowObjects_(ss.getSheetByName(TRACKER_CONFIG.SHEETS.DECISIONS));

  function countBy(key, rows) {
    const out = {};
    rows.forEach(function (r) {
      const k = r[key] || 'Unknown';
      out[k] = (out[k] || 0) + 1;
    });
    return out;
  }

  const statusCounts = countBy('status', issues);
  const blocked = issues.filter(function (i) { return String(i.status).toLowerCase() === 'blocked'; }).slice(0, 10);
  const openDecisions = decisions.filter(function (d) { return String(d.status).toLowerCase() !== 'resolved'; }).slice(0, 10);

  const lines = [];
  lines.push('Weekly Tracker Summary');
  lines.push('');
  lines.push('Total issues: ' + issues.length);
  lines.push('Total decisions: ' + decisions.length);
  lines.push('');
  lines.push('Issue status breakdown:');
  Object.keys(statusCounts).sort().forEach(function (k) {
    lines.push('- ' + k + ': ' + statusCounts[k]);
  });
  lines.push('');
  lines.push('Top blocked issues:');
  if (!blocked.length) {
    lines.push('- None');
  } else {
    blocked.forEach(function (i) {
      lines.push('- ' + (i.id || '') + ' | ' + (i.title || '') + ' | blocker: ' + (i.blocker || '—'));
    });
  }
  lines.push('');
  lines.push('Open decisions:');
  if (!openDecisions.length) {
    lines.push('- None');
  } else {
    openDecisions.forEach(function (d) {
      lines.push('- ' + (d.decision_id || '') + ' | ' + (d.topic || '') + ' | ' + (d.status || ''));
    });
  }
  lines.push('');
  lines.push('Generated at: ' + nowIso_());

  MailApp.sendEmail({
    to: recipient,
    subject: '[Tracker] Weekly Summary',
    body: lines.join('\n'),
  });
  logActivity_('system', 'weekly_summary', 'email_sent', '', recipient);
  return { ok: true };
}

function normalizeOwnerInput_(value) {
  var v = String(value || '').trim();
  if (!v) return '';
  if (v.indexOf('@') >= 0) return v.toLowerCase();
  // allow known team names, convert to email
  var lowered = v.toLowerCase();
  return lowered + '@' + TRACKER_CONFIG.EMAIL_DOMAIN;
}
