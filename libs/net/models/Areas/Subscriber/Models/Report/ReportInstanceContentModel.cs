using TNO.API.Models;

namespace TNO.API.Areas.Subscriber.Models.Report;

/// <summary>
/// ReportInstanceContentModel class, provides a model that represents an report instance content relationship.
/// </summary>
public class ReportInstanceContentModel : AuditColumnsModel
{
    #region Properties
    /// <summary>
    /// get/set - Primary key identity.
    /// </summary>
    public long InstanceId { get; set; }

    /// <summary>
    /// get/set - Foreign key to the report definition.
    /// </summary>
    public long ContentId { get; set; }

    /// <summary>
    /// get/set - The content.
    /// </summary>
    public Content.ContentModel? Content { get; set; }

    /// <summary>
    /// get/set - The section to group content in.
    /// </summary>
    public string SectionName { get; set; } = "";

    /// <summary>
    /// get/set - The sort order of the content.
    /// </summary>
    public int SortOrder { get; set; }
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of an ReportInstanceContentModel.
    /// </summary>
    public ReportInstanceContentModel() { }

    /// <summary>
    /// Creates a new instance of an ReportInstanceContentModel, initializes with specified parameter.
    /// </summary>
    /// <param name="entity"></param>
    public ReportInstanceContentModel(Entities.ReportInstanceContent entity) : base(entity)
    {
        this.InstanceId = entity.InstanceId;
        this.ContentId = entity.ContentId;
        this.SectionName = entity.SectionName ?? "";
        this.SortOrder = entity.SortOrder;
        this.Content = entity.Content != null ? new Content.ContentModel(entity.Content) : null;
    }
    #endregion

    #region Methods
    /// <summary>
    /// Explicit conversion to entity.
    /// </summary>
    /// <param name="model"></param>
    public static explicit operator Entities.ReportInstanceContent(ReportInstanceContentModel model)
    {
        return new Entities.ReportInstanceContent(model.InstanceId, model.ContentId, model.SectionName)
        {
            SortOrder = model.SortOrder,
            Content = model.Content != null ? (Entities.Content)model.Content : null,
            Version = model.Version ?? 0
        };
    }
    #endregion
}
