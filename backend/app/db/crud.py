from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models import ConfigHistory, KnowledgeBase
from datetime import datetime


def create_config_history(
    db: Session,
    task_id: str,
    input_config: Dict[str, Any],
    session_id: Optional[str] = None
) -> ConfigHistory:
    db_config = ConfigHistory(
        task_id=task_id,
        input_config=input_config,
        session_id=session_id,
        status="processing"
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


def get_config_history_by_task_id(
    db: Session,
    task_id: str
) -> Optional[ConfigHistory]:
    return db.query(ConfigHistory).filter(ConfigHistory.task_id == task_id).first()


def update_config_history_result(
    db: Session,
    task_id: str,
    nic_recommendation: Optional[Dict[str, Any]] = None,
    network_design: Optional[Dict[str, Any]] = None,
    bom_list: Optional[List[Dict[str, Any]]] = None,
    validation_report: Optional[Dict[str, Any]] = None,
    status: str = "completed"
) -> Optional[ConfigHistory]:
    db_config = db.query(ConfigHistory).filter(ConfigHistory.task_id == task_id).first()
    if db_config:
        if nic_recommendation is not None:
            db_config.nic_recommendation = nic_recommendation
        if network_design is not None:
            db_config.network_design = network_design
        if bom_list is not None:
            db_config.bom_list = bom_list
        if validation_report is not None:
            db_config.validation_report = validation_report
        db_config.status = status
        db.commit()
        db.refresh(db_config)
    return db_config


def update_config_history_status(
    db: Session,
    task_id: str,
    status: str,
    error_message: Optional[str] = None
) -> Optional[ConfigHistory]:
    db_config = db.query(ConfigHistory).filter(ConfigHistory.task_id == task_id).first()
    if db_config:
        db_config.status = status
        if error_message:
            db_config.error_message = error_message
        db.commit()
        db.refresh(db_config)
    return db_config


def get_config_history_by_session_id(
    db: Session,
    session_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[ConfigHistory]:
    return db.query(ConfigHistory).filter(
        ConfigHistory.session_id == session_id
    ).order_by(
        desc(ConfigHistory.created_at)
    ).offset(skip).limit(limit).all()


def count_config_history_by_session_id(
    db: Session,
    session_id: str
) -> int:
    return db.query(ConfigHistory).filter(ConfigHistory.session_id == session_id).count()


def get_all_config_history(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[ConfigHistory]:
    return db.query(ConfigHistory).order_by(
        desc(ConfigHistory.created_at)
    ).offset(skip).limit(limit).all()


def create_knowledge_base_entry(
    db: Session,
    source_url: Optional[str] = None,
    title: Optional[str] = None,
    category: Optional[str] = None,
    content: Optional[str] = None,
    vector_id: Optional[str] = None
) -> KnowledgeBase:
    db_entry = KnowledgeBase(
        source_url=source_url,
        title=title,
        category=category,
        content=content,
        vector_id=vector_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_knowledge_base_entries(
    db: Session,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[KnowledgeBase]:
    query = db.query(KnowledgeBase)
    if category:
        query = query.filter(KnowledgeBase.category == category)
    return query.order_by(desc(KnowledgeBase.last_updated)).offset(skip).limit(limit).all()


def get_knowledge_base_by_vector_id(
    db: Session,
    vector_id: str
) -> Optional[KnowledgeBase]:
    return db.query(KnowledgeBase).filter(KnowledgeBase.vector_id == vector_id).first()
