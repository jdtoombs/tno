export enum ReportStatusName {
  /// <summary>
  /// Report is pending to be sent.
  /// </summary>
  Pending = 'Pending',

  /// <summary>
  /// Report is accepted by CHES.
  /// </summary>
  Accepted = 'Accepted',

  /// <summary>
  /// Report is sent.
  /// </summary>
  Completed = 'Completed',

  /// <summary>
  /// Report was cancelled.
  /// </summary>
  Cancelled = 'Cancelled',

  /// <summary>
  /// Report failed to send.
  /// </summary>
  Failed = 'Failed',
}
