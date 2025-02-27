import db from '../../models/index.js';
import { Op, Sequelize } from 'sequelize';

const getTags = async (req, res) => {
  try {
    const limit = 5;

    const tagUsageResult = await db.Template.sequelize.query(
      `
      SELECT 
          CAST(tagId AS UNSIGNED) AS tagId, 
          COUNT(*) AS usageCount
      FROM (
          SELECT 
              JSON_UNQUOTE(tagId) AS tagId
          FROM Template,
          JSON_TABLE(
              IFNULL(tagIds, '[]'),  
              '$[*]' COLUMNS (tagId JSON PATH '$')
          ) AS jt
      ) AS extractedTags
      WHERE tagId IS NOT NULL AND tagId != ''  
      GROUP BY tagId
      ORDER BY usageCount DESC
      LIMIT :limit;
      `,
      {
        replacements: { limit },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    

    if (tagUsageResult.length === 0) {
      return res.json([]);
    }

    const tagIds = tagUsageResult.map(row => row.tagId);

    const tags = await db.Tag.findAll({
      where: {
        id: {
          [Op.in]: tagIds,
        },
      },
      attributes: ['id', 'tagName'],
    });

    res.status(200).json({
      message: 'Tags retrieved successfully.',
      tags: tags.map(tag => ({ id: tag.id, tagName: tag.tagName })),
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getTags;